import json
from unittest.mock import patch

from django.core import mail
from django.test import TestCase, override_settings
from django.urls import reverse

from .models import ContactMessage


@override_settings(SECURE_SSL_REDIRECT=False)
class ContactViewTests(TestCase):
    def post_contact(self):
        return self.client.post(
            reverse("portfolio:contact"),
            data=json.dumps(
                {
                    "name": "Test User",
                    "email": "visitor@example.com",
                    "subject": "Project enquiry",
                    "message": "Can we talk about a Django project?",
                }
            ),
            content_type="application/json",
        )

    @override_settings(
        EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
        EMAIL_HOST_USER="owner@example.com",
        EMAIL_HOST_PASSWORD="secret",
        DEFAULT_FROM_EMAIL="owner@example.com",
        CONTACT_EMAIL_ASYNC=False,
    )
    def test_contact_sends_owner_and_visitor_emails_and_returns_success(self):
        response = self.post_contact()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["success"], True)
        self.assertEqual(response.json()["message"], "✅ Thank you! Your message has been received.")
        self.assertEqual(ContactMessage.objects.count(), 1)
        self.assertEqual(len(mail.outbox), 2)
        self.assertEqual(mail.outbox[0].to, ["owner@example.com"])
        self.assertEqual(mail.outbox[0].reply_to, ["visitor@example.com"])
        self.assertEqual(mail.outbox[1].to, ["visitor@example.com"])
        self.assertIn("Thank you! Your message has been received.", mail.outbox[1].body)

    @override_settings(EMAIL_HOST_USER="", EMAIL_HOST_PASSWORD="")
    def test_contact_returns_error_when_email_is_not_configured(self):
        response = self.post_contact()

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.json()["success"], False)
        self.assertIn("Email service is not configured", response.json()["error"])
        self.assertEqual(ContactMessage.objects.count(), 0)

    @override_settings(
        EMAIL_HOST_USER="owner@example.com",
        EMAIL_HOST_PASSWORD="secret",
        DEFAULT_FROM_EMAIL="owner@example.com",
        CONTACT_EMAIL_ASYNC=False,
    )
    @patch("portfolio.views.EmailMessage.send", side_effect=Exception("SMTP failed"))
    def test_contact_returns_error_when_email_send_fails(self, mocked_send):
        response = self.post_contact()

        self.assertEqual(response.status_code, 502)
        self.assertEqual(response.json()["success"], False)
        self.assertIn("email delivery failed", response.json()["error"])
        self.assertEqual(ContactMessage.objects.count(), 1)
        mocked_send.assert_called_once_with(fail_silently=False)
