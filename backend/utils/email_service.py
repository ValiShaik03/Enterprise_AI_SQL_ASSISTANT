import smtplib
import os

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from dotenv import load_dotenv

load_dotenv()


SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
EMAIL_FROM = os.getenv("EMAIL_FROM")


def send_email(
    to_email: str,
    subject: str,
    body: str,
):
    message = MIMEMultipart()

    message["From"] = EMAIL_FROM
    message["To"] = to_email
    message["Subject"] = subject

    message.attach(
        MIMEText(body, "plain")
    )

    server = smtplib.SMTP(
        SMTP_SERVER,
        SMTP_PORT,
    )

    server.starttls()

    server.login(
        SMTP_USERNAME,
        SMTP_PASSWORD,
    )

    response = server.sendmail(
    EMAIL_FROM,
    to_email,
    message.as_string(),
)

    print("SMTP Response:", response)

    server.quit()