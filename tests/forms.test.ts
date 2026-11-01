import assert from "node:assert/strict";
import { test } from "node:test";
import { contactSchema, fieldErrors, reservationSchema } from "../lib/forms/schemas";

const reservation = {
  name: "Test Guest",
  phone: "+90 555 000 0000",
  email: "",
  date: "2100-01-01",
  time: "19:00",
  guests: 2,
};

test("contact inputs are trimmed and validated with localized error keys", () => {
  const valid = contactSchema.parse({ name: " Guest ", email: "guest@example.com ", message: " Hello " });
  assert.equal(valid.name, "Guest");
  assert.equal(valid.message, "Hello");
  const invalid = contactSchema.safeParse({ name: " ", email: "invalid", message: "" });
  assert.equal(invalid.success, false);
  if (!invalid.success) {
    assert.deepEqual(fieldErrors(invalid.error), { name: "required", email: "email", message: "required" });
  }
  assert.equal(contactSchema.safeParse({ ...valid, message: "x".repeat(4001) }).success, false);
  assert.equal(contactSchema.safeParse({ ...valid, website: "bot" }).success, false);
});

test("reservation dates must be real calendar dates and not in the past", () => {
  for (const date of ["2100-02-30", "2100-02-29", "2100-13-01", "2100-00-01", "2100-04-31", "2000-01-01", ""]) {
    assert.equal(reservationSchema.safeParse({ ...reservation, date }).success, false, date);
  }
  for (const date of ["2096-02-29", "2100-12-31"]) {
    assert.equal(reservationSchema.safeParse({ ...reservation, date }).success, true, date);
  }
});

test("reservation times use valid 24-hour hours and minutes", () => {
  for (const time of ["99:99", "24:00", "19:60", "9:00", ""]) {
    assert.equal(reservationSchema.safeParse({ ...reservation, time }).success, false, time);
  }
  for (const time of ["00:00", "19:00", "23:59"]) {
    assert.equal(reservationSchema.safeParse({ ...reservation, time }).success, true, time);
  }
});

test("reservation guest limits, optional email, phone and note lengths", () => {
  for (const guests of [0, 21, 1.5, "not a number"]) {
    assert.equal(reservationSchema.safeParse({ ...reservation, guests }).success, false);
  }
  for (const guests of ["1", "20"]) {
    assert.equal(reservationSchema.safeParse({ ...reservation, guests }).success, true);
  }
  assert.equal(reservationSchema.safeParse({ ...reservation, email: "invalid" }).success, false);
  assert.equal(reservationSchema.safeParse({ ...reservation, phone: "abc" }).success, false);
  assert.equal(reservationSchema.safeParse({ ...reservation, notes: "x".repeat(1001) }).success, false);
  assert.equal(reservationSchema.safeParse({ ...reservation, website: "bot" }).success, false);
});
