# KARMEN MOVES · WhatsApp order kit

Number: **+60 11 1635 0635**

## How order enquiries reach you

1. A customer taps **Order this** on any product, or opens **Order enquiry** near the bottom of the website.
2. Three short steps: choose product and quantity, add contact and delivery details, review the summary.
3. They read the privacy notice and tick the consent box. Only then can WhatsApp open.
4. WhatsApp opens with the enquiry written out, addressed to you. **Nothing reaches you until they press Send in WhatsApp.**
5. The website shows a "One last step" screen with their enquiry reference. It tells them clearly that the enquiry has not been sent yet and that they must press Send. It never says the enquiry was received, because the website cannot know that.

So the only proof an enquiry exists is the message in your WhatsApp. If a customer mentions a reference you cannot find, kindly ask them to check whether they pressed Send.

The website never shows prices, stock or payment details. Those are confirmed by you in the chat.

You receive it looking like this:

```
*NEW ORDER ENQUIRY · KARMEN MOVES*
Enquiry ref: KM-261103-7QH4X

*Product*
MOB Neck Healer
Quantity: 1

*Customer*
Name: Siti Aminah
Phone: 012 345 6789
Email: siti@example.com

*Delivery*
12 Jalan Bunga Raya, Taman Melati
53100 Kuala Lumpur
Kuala Lumpur

*Notes*
Please call after 6pm

This is an order enquiry only. I understand no payment is required yet and Karmen will reply personally to confirm the details.
I agree to the KARMEN MOVES privacy notice.
```

(The customer above is an example only.)

Every enquiry reference is unique: the date plus five random characters, with no confusing letters like O, 0, I or 1. Search the reference in WhatsApp to find any enquiry later.

The maximum quantity per enquiry (5) is set in `src/lib/order.ts` as `MAX_QTY`.

---

## Set up WhatsApp Business (10 minutes)

Use the free **WhatsApp Business** app on your phone. Go to **Settings → Business tools**.

### 1. Greeting message
Business tools → Greeting message → On. Send to: Everyone.

> Hi, thank you for reaching out to KARMEN MOVES 🤍
> I'm Karmen, and I read every message myself. I'll reply as soon as I can, usually within the same day.
> If you've sent an order enquiry, I'll confirm the price, stock and delivery with you before you pay anything.

### 2. Away message
Business tools → Away message → On. Schedule: Outside of business hours.

> Hi, thank you for your message. I'm away right now, but I'll get back to you personally as soon as I'm back.
> Your order enquiry is safe here with me. No payment is needed until I confirm everything with you.

### 3. Quick replies
Business tools → Quick replies → tap **+**. Type the shortcut (like `/confirm`) in a chat to send it instantly. Fill in the parts in [brackets] each time.

**/received**
> Hi [name], I've received your order enquiry ([ref]). Thank you so much! Let me check stock and delivery for you, and I'll come back to you shortly.

**/confirm**
> Hi [name], here's your order summary:
> Product: [product] × [qty]
> Price: RM[price]
> Delivery to [state]: RM[delivery fee]
> Total: RM[total]
> Estimated delivery: [x] working days
>
> If everything looks right, just reply "Yes" and I'll send payment details.

**/pay** (send only after the customer has agreed to the confirmed price)
> Thank you! You can pay by:
> [bank name] · [account name] · [account number]
> or DuitNow / Touch 'n Go: [details]
>
> Please send me the receipt here once done, with your ref [ref].

**/paid**
> Received with thanks, [name]! Your payment is confirmed. I'll arrange your delivery and send the tracking number once it's on the way.

**/shipped**
> Good news, your order is on its way 📦
> Courier: [courier]
> Tracking: [tracking number]
> If anything isn't right when it arrives, message me straight away and I'll help.

**/thanks**
> I hope it brings you a little more comfort every day. Thank you for supporting KARMEN MOVES. It truly means a lot to me. If you ever feel like sharing how it's going, I'd love to hear. 🤍

**/health**
> I'm really glad you asked. These are comfort and support products, not medical treatment, so I can't promise any medical result. If you have pain, an injury or a health condition, please check with your doctor or physiotherapist first. I'm always happy to share what I know about the product honestly.

**/official**
> MOB Neck & Back Rest makes this product. KARMEN MOVES is my own independent brand, and I personally feature their products. You can read the official details here: https://www.neckandbackpain.my/

### 4. Labels (keep orders tidy)
Open a chat → tap the name → Labels. Create:

* 🟡 New order
* 🟠 Awaiting payment
* 🟢 Paid
* 🔵 Shipped
* ⚪ Completed

Move each customer along as the order progresses. Tap **Labels** on the Chats screen to see all orders in each stage.

---

## Want it fully automatic later?

The kit above is free and needs no tech. If orders grow, a next step is a small Cloudflare Pages Function that saves each order to a Google Sheet and emails you a copy, alongside the WhatsApp message. Just ask and I'll build it.
