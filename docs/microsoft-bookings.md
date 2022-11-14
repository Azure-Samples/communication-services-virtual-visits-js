# How to Configure Microsoft Bookings

This sample uses takes advantage of the Microsoft 365 Bookings app to power the consumer scheduling experience and create meetings for providers. Follow the steps below to create a Microsoft Bookings calendar and use it in the sample.

### Steps

- [Create a Microsoft Bookings Calendar](#bookingscalendar)
- [Set the Microsoft Bookings URL in the Sample](#bookingsurl)
- [Integrate the Sample in Microsoft Bookings](#bookingssampleintegration)
- [Make an appointment in the Sample](#sampleappointment)

## <a id="bookingscalendar">Create a Microsoft Bookings Calendar</a>

Go to https://outlook.office.com/bookings/homepage to create a Microsoft Bookings calendar.

![bookings-create-calendar.png](../docs/images/bookings/bookings-create-calendar.png)

Ensure the `Make this a Teams meeting` setting is enabled.

![bookings-teams-meeting.png](../docs/images/bookings/bookings-teams-meeting.png)

Ensure the bookings page is publicly accessible.

![bookings-public-page.png](../docs/images/bookings/bookings-public-page.png)

Click `Create calendar`.

## <a id="bookingsurl">Set the Microsoft Bookings URL in the Sample</a>

Copy the Microsoft Bookings URL from your Bookings calendar.

![bookings-page-url.png](../docs/images/bookings/bookings-page-url.png)

### Configure using environment variables

```
VV_MICROSOFT_BOOKINGS_URL = "Your Bookings URL"
```

### Configure using defaultConfig.json

```
{
    ...
    "microsoftBookingsUrl": "Your Bookings URL"
    ...
}
```

## <a id="bookingssampleintegration">Integrate the Sample in Microsoft Bookings</a>

Consumers want to jump directly to the virtual appointment from the email reminder they receive from Bookings. In Bookings, you can provide a URL prefix that will be used in reminders.

Once you have deployed the Sample to Azure App Service, copy the App's URL.

![bookings-appservice-url.png](../docs/images/bookings/bookings-appservice-url.png)

In Bookings, paste the App Service URL suffixed with `/visit`

![bookings-appservice-url-integration.png](../docs/images/bookings/bookings-appservice-url-integration.png)

Click `Save`.

## <a id="sampleappointment">Make an appointment in the Sample</a>

Go to the `/book` page in your Sample where your public Bookings page is rendered, and make an appointment.

![bookings-book-page.png](../docs/images/bookings/bookings-book-page.png)

Click `Book`.

As an end-user, you will receive an email confirming the appointment. Click the `Join your appointment` button to join the appointment and start the call using Azure Communication Services.

![bookings-book-reminder.png](../docs/images/bookings/bookings-book-reminder.png)

As a professional, you will also receive an email confirming the end-user's appointment. Join the appointment through Teams.

![bookings-book-reminder-teams.png](../docs/images/bookings/bookings-book-reminder-teams.png)

You have successfully integrated the Virtual Appointment Sample and Microsoft Bookings! You are now ready to join appointments through Teams as a professional, and through Azure Communication Services as an end-user.