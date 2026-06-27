import json
import logging

from django.conf import settings
from django.core.mail import EmailMessage
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_POST

from .models import ContactMessage

logger = logging.getLogger(__name__)


def index(request):
    context = {
        'page_title': 'Jagadesh S - Full Stack Developer',
        'meta_description': (
            'Full Stack Developer specializing in Python, Django, REST APIs, '
            'WebSockets and PostgreSQL. Building scalable enterprise applications.'
        ),
    }
    return render(request, 'portfolio/index.html', context)


@require_POST
def contact(request):
    try:
        data = json.loads(request.body)

        name = data.get("name", "").strip()
        visitor_email = data.get("email", "").strip()
        subject = data.get("subject", "").strip()
        message = data.get("message", "").strip()

        if not all([name, visitor_email, subject, message]):
            return JsonResponse(
                {
                    "success": False,
                    "error": "All fields are required.",
                },
                status=400,
            )

        if not settings.EMAIL_HOST_USER or not settings.EMAIL_HOST_PASSWORD:
            return JsonResponse(
                {
                    "success": False,
                    "error": "Email service is not configured. Check EMAIL_HOST_USER and EMAIL_HOST_PASSWORD.",
                },
                status=500,
            )

        contact = ContactMessage.objects.create(
            name=name,
            email=visitor_email,
            subject=subject,
            message=message,
        )

        email_subject = f"Portfolio Contact: {subject}"
        email_body = f"""
You have received a new portfolio enquiry.

---------------------------------------
Name      : {name}
Email     : {visitor_email}
Subject   : {subject}
---------------------------------------

Message:

{message}

"""

        try:
            mail = EmailMessage(
                subject=email_subject,
                body=email_body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[settings.EMAIL_HOST_USER],
                reply_to=[visitor_email],
            )
            mail.send(fail_silently=False)
        except Exception as exc:
            logger.exception("Email sending failed.")
            return JsonResponse(
                {
                    "success": False,
                    "error": "Message saved, but email delivery failed. Please check SMTP credentials/app password.",
                    "details": str(exc) if settings.DEBUG else "",
                    "contact_id": contact.id,
                },
                status=502,
            )

        return JsonResponse(
            {
                "success": True,
                "message": "Thank you! Your message has been received. I'll get back to you soon.",
            }
        )

    except json.JSONDecodeError:
        return JsonResponse(
            {
                "success": False,
                "error": "Invalid JSON.",
            },
            status=400,
        )

    except Exception as exc:
        logger.exception("Contact API failed.")
        return JsonResponse(
            {
                "success": False,
                "error": str(exc),
            },
            status=500,
        )
