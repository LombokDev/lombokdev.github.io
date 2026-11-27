---
layout: register
title: Hacktoberfest 2025 Registration
api_url: "https://example.com/api/register"
open_at: 2025-08-01
closed_at: 2025-10-01
event_id: 26b5ada4-8808-45ed-90ca-c66301221b33

forms:
  - title: Phone
    name: phone
    type: text
    required: true
  - title: Gender
    name: gender
    type: options
    required: false
    options: ["male", "female"]
  - title: T-Shirt Size
    name: tshirt
    type: options
    required: false
    options: ["S", "M", "L", "XL"]
  - title: Agreement
    name: agreement
    type: check
    required: true
    details: By checking this, you are agree with our term and condition (https://term.condition)
---
