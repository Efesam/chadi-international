import { test, describe } from "node:test";
import assert from "node:assert/strict";

describe("mailchimp", () => {
  test("isMailchimpConfigured is false when env vars are unset", async () => {
    delete process.env.MAILCHIMP_API_KEY;
    delete process.env.MAILCHIMP_AUDIENCE_ID;

    const { isMailchimpConfigured } = await import(`../mailchimp.js?t=${Date.now()}`);
    assert.equal(isMailchimpConfigured(), false);
  });

  test("subscribeToMailchimp no-ops when not configured, without making a network call", async () => {
    delete process.env.MAILCHIMP_API_KEY;
    delete process.env.MAILCHIMP_AUDIENCE_ID;

    const { subscribeToMailchimp } = await import(`../mailchimp.js?t=${Date.now()}`);
    const result = await subscribeToMailchimp("someone@example.com");
    assert.deepEqual(result, { synced: false, reason: "not_configured" });
  });

  test("isMailchimpConfigured is true once both env vars are set", async () => {
    process.env.MAILCHIMP_API_KEY = "fakekey123-us21";
    process.env.MAILCHIMP_AUDIENCE_ID = "fakeaudience";

    const { isMailchimpConfigured } = await import(`../mailchimp.js?t=${Date.now()}`);
    assert.equal(isMailchimpConfigured(), true);

    delete process.env.MAILCHIMP_API_KEY;
    delete process.env.MAILCHIMP_AUDIENCE_ID;
  });
});
