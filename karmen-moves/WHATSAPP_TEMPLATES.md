# KARMEN MOVES · WhatsApp order kit

Number: **+60 11 1635 0635**

## How orders reach you

1. A customer taps **Order this** on any product, or fills in **Place an order** near the bottom of the website.
2. WhatsApp opens on their phone with a ready order message addressed to you. They just press send.
3. You receive it looking like this:

```
*NEW ORDER REQUEST · KARMEN MOVES*
Ref: KM-031126-4821

*Order*
Product: MOB Neck Healer
Quantity: 1

*Customer*
Name: Siti Aminah
Phone: 012 345 6789

*Delivery*
Address: 12 Jalan Bunga Raya, Taman Melati
Postcode: 53100
State: Kuala Lumpur

Preferred payment: DuitNow QR
Notes: Please call after 6pm

Please confirm the price, stock and delivery. Thank you!
```

(The customer above is an example only.)

The **Ref** code helps you find any order later. Just search it in WhatsApp.

Payment options and the maximum quantity can be changed in `src/data/content.ts` under `orderSettings`.

---

## Set up WhatsApp Business (10 minutes)

Use the free **WhatsApp Business** app on your phone. Go to **Settings → Business tools**.

### 1. Greeting message
Business tools → Greeting message → On. Send to: Everyone.

> Hi, thank you for reaching out to KARMEN MOVES 🤍
> I'm Karmen, and I read every message myself. I'll reply as soon as I can, usually within the same day.
> If you've sent an order request, I'll confirm the price, stock and delivery with you before you pay anything.

### 2. Away message
Business tools → Away message → On. Schedule: Outside of business hours.

> Hi, thank you for your message. I'm away right now, but I'll get back to you personally as soon as I'm back.
> Your order request is safe here with me. Nothing needs to be paid until I confirm everything with you.

### 3. Quick replies
Business tools → Quick replies → tap **+**. Type the shortcut (like `/confirm`) in a chat to send it instantly. Fill in the parts in [brackets] each time.

**/received**
> Hi [name], I've received your order request ([ref]). Thank you so much! Let me check stock and delivery for you, and I'll come back to you shortly.

**/confirm**
> Hi [name], here's your order summary:
> Product: [product] × [qty]
> Price: RM[price]
> Delivery to [state]: RM[delivery fee]
> Total: RM[total]
> Estimated delivery: [x] working days
>
> If everything looks right, just reply "Yes" and I'll send payment details.

**/pay**
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
