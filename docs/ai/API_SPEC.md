API_SPEC.md

# Sturdy API Specification

## Purpose

This document defines the backend API contract for Sturdy.

It specifies:

- endpoint responsibilities
- request and response formats
- authentication requirements
- error handling
- safety routing behavior
- usage expectations

The API is designed to support a mobile-first AI parenting product that is:

- fast
- structured
- safety-aware
- child-specific
- production-ready

---

# API Design Principles

The Sturdy API should follow these principles:

- all sensitive endpoints require authentication
- AI responses should be structured and predictable
- safety escalation must happen before normal coaching
- endpoints should be narrow in scope
- error responses should be machine-readable
- the client should never need to guess behavior

---

# Base URL

In production, endpoints are expected to live behind Supabase Edge Functions.

Example base path:

```text
/functions/v1/
Example full endpoint:
Text
Copy code
/functions/v1/chat-parenting-assistant
Authentication
All user-specific endpoints require a valid authenticated user session.
Clients must send:
Http
Copy code
Authorization: Bearer <supabase_access_token>
Auth Rules
requests without a valid token must return 401 Unauthorized
requests for resources not owned by the user must return 403 Forbidden or 404 Not Found depending on exposure policy
service-role credentials must never be exposed to the client
Common Headers
Request Headers
Http
Copy code
Content-Type: application/json
Authorization: Bearer <token>
Response Headers
Http
Copy code
Content-Type: application/json
CORS headers should be included where appropriate for web-compatible environments.
Standard Error Format
All endpoints should return a consistent error structure.
Json
Copy code
{
  "error": {
    "code": "invalid_request",
    "message": "Missing required field: childProfileId",
    "details": null
  }
}
Error Fields
code
Stable machine-readable string.
message
Human-readable explanation.
details
Optional structured metadata.
Standard Error Codes
Suggested shared error codes:
unauthorized
forbidden
not_found
invalid_request
validation_failed
subscription_required
rate_limited
safety_escalation
model_error
upstream_error
internal_error
Resource Overview
Core API areas:
auth-aware profile access
child profile management
conversations
messages
AI generation
saved scripts
feedback and learning
safety and subscription routing
1. Chat Parenting Assistant
Endpoint
Http
Copy code
POST /functions/v1/chat-parenting-assistant
Purpose
Main AI generation endpoint.
It receives a parent message, applies safety checks, loads child context, and returns a structured response.
Auth
Required.
Request Body
Json
Copy code
{
  "conversationId": "uuid",
  "childProfileId": "uuid",
  "mode": "hard_moment",
  "message": "My child is screaming because we have to leave the park."
}
Request Fields
conversationId
Required string UUID.
If the conversation does not exist, the backend may create it.
childProfileId
Required string UUID.
Must belong to the authenticated user.

Note:
The backend loads the child profile for this `childProfileId` and uses the child’s exact single age (`child_age`) as part of prompt assembly.
Exact-age adaptation is required; do not use broad age bands.

mode
Required enum.
Allowed values:
hard_moment
reflection
coach
message
Required string.
Parent-entered situation text.
Success Response
Json
Copy code
{
  "mode": "hard_moment",
  "situation_summary": "Leaving the park is overwhelming because a fun activity is ending.",
  "parent_tone": "Low voice. Few words.",
  "regulate": {
    "parent_action": "Take one breath and move closer.",
    "script": "I’m here. I won’t let you kick."
  },
  "connect": {
    "parent_action": "Name the feeling simply.",
    "script": "You really wanted to stay."
  },
  "guide": {
    "parent_action": "Set the limit and next step.",
    "script": "We are leaving now. Hold my hand or I will carry you."
  },
  "avoid": [
    "Stop this right now",
    "You’re embarrassing me"
  ],
  "notes": [
    "Keep talking minimal."
  ],
  "safety_escalation": false
}
Safety Escalation Response
If the message triggers safety routing, the endpoint still returns 200 OK, but with a safety-specific payload.
Json
Copy code
{
  "mode": "hard_moment",
  "situation_summary": "This sounds like a possible immediate safety situation.",
  "parent_tone": "Clear, steady, direct.",
  "regulate": {
    "parent_action": "Pause and focus on immediate safety first.",
    "script": "I need to keep everyone safe right now."
  },
  "connect": {
    "parent_action": "Use very few words.",
    "script": "I’m here. I’m focusing on safety first."
  },
  "guide": {
    "parent_action": "Move to safety steps and get urgent help if needed.",
    "script": "We are stopping and getting help right now."
  },
  "avoid": [
    "arguing",
    "long explanations",
    "threats"
  ],
  "notes": [
    "If anyone is in immediate danger, contact local emergency services now."
  ],
  "safety_escalation": true
}
Possible Errors
400 Invalid Request
Json
Copy code
{
  "error": {
    "code": "invalid_request",
    "message": "Missing required field: message",
    "details": null
  }
}
401 Unauthorized
Json
Copy code
{
  "error": {
    "code": "unauthorized",
    "message": "Authentication required.",
    "details": null
  }
}
404 Child Profile Not Found
Json
Copy code
{
  "error": {
    "code": "not_found",
    "message": "Child profile not found.",
    "details": null
  }
}
402 Subscription Required
Json
Copy code
{
  "error": {
    "code": "subscription_required",
    "message": "An active subscription is required for this feature.",
    "details": {
      "entitlement": "premium"
    }
  }
}
429 Rate Limited
Json
Copy code
{
  "error": {
    "code": "rate_limited",
    "message": "Too many requests. Please try again shortly.",
    "details": null
  }
}
500 Model or Server Error
Json
Copy code
{
  "error": {
    "code": "model_error",
    "message": "We couldn't generate a script right now.",
    "details": null
  }
}
2. Create Conversation
Endpoint
Http
Copy code
POST /functions/v1/create-conversation
Purpose
Creates a conversation explicitly before the first message, if the client wants to control the lifecycle.
Auth
Required.
Request Body
Json
Copy code
{
  "childProfileId": "uuid",
  "mode": "hard_moment",
  "title": "Leaving the park"
}
Success Response
Json
Copy code
{
  "id": "uuid",
  "user_id": "uuid",
  "child_profile_id": "uuid",
  "mode": "hard_moment",
  "title": "Leaving the park",
  "created_at": "2026-03-11T10:00:00Z",
  "updated_at": "2026-03-11T10:00:00Z"
}
Errors
401 unauthorized
404 not_found
400 invalid_request
3. List Conversations
Endpoint
Http
Copy code
GET /functions/v1/list-conversations?childProfileId=<uuid>&limit=20&cursor=<cursor>
Purpose
Returns a paginated list of conversations for the authenticated user.
Auth
Required.
Query Parameters
childProfileId
Optional. Filters conversations for one child.
limit
Optional integer. Default 20. Max recommended 100.
cursor
Optional pagination cursor.
Success Response
Json
Copy code
{
  "items": [
    {
      "id": "uuid",
      "child_profile_id": "uuid",
      "mode": "hard_moment",
      "title": "Leaving the park",
      "summary": "Support for a difficult park transition.",
      "created_at": "2026-03-11T10:00:00Z",
      "updated_at": "2026-03-11T10:05:00Z"
    }
  ],
  "next_cursor": "opaque-cursor-or-null"
}
4. Get Conversation
Endpoint
Http
Copy code
GET /functions/v1/get-conversation?id=<conversationId>
Purpose
Returns a conversation and its messages.
Auth
Required.
Success Response
Json
Copy code
{
  "conversation": {
    "id": "uuid",
    "child_profile_id": "uuid",
    "mode": "hard_moment",
    "title": "Leaving the park",
    "summary": null,
    "created_at": "2026-03-11T10:00:00Z",
    "updated_at": "2026-03-11T10:05:00Z"
  },
  "messages": [
    {
      "id": "uuid",
      "role": "user",
      "content": "My child is screaming because we have to leave the park.",
      "structured": null,
      "created_at": "2026-03-11T10:00:10Z"
    },
    {
      "id": "uuid",
      "role": "assistant",
      "content": "{\"mode\":\"hard_moment\", ... }",
      "structured": {
        "mode": "hard_moment",
        "situation_summary": "Leaving the park is overwhelming because a fun activity is ending.",
        "parent_tone": "Low voice. Few words.",
        "regulate": {
          "parent_action": "Take one breath and move closer.",
          "script": "I’m here. I won’t let you kick."
        },
        "connect": {
          "parent_action": "Name the feeling simply.",
          "script": "You really wanted to stay."
        },
        "guide": {
          "parent_action": "Set the limit and next step.",
          "script": "We are leaving now. Hold my hand or I will carry you."
        },
        "avoid": [
          "Stop this right now"
        ],
        "notes": [
          "Keep talking minimal."
        ],
        "safety_escalation": false
      },
      "created_at": "2026-03-11T10:00:12Z"
    }
  ]
}
Errors
401 unauthorized
404 not_found
5. Archive Conversation
Endpoint
Http
Copy code
POST /functions/v1/archive-conversation
Purpose
Soft-archives a conversation without deleting it.
Auth
Required.
Request Body
Json
Copy code
{
  "conversationId": "uuid"
}
Success Response
Json
Copy code
{
  "success": true,
  "conversationId": "uuid",
  "archived": true
}
6. Delete Conversation
Endpoint
Http
Copy code
POST /functions/v1/delete-conversation
Purpose
Deletes a conversation and associated messages.
Auth
Required.
Request Body
Json
Copy code
{
  "conversationId": "uuid"
}
Success Response
Json
Copy code
{
  "success": true,
  "conversationId": "uuid"
}
7. Save Script
Endpoint
Http
Copy code
POST /functions/v1/save-script
Purpose
Stores a structured assistant response as a reusable saved script.
Auth
Required.
Request Body
Json
Copy code
{
  "childProfileId": "uuid",
  "sourceConversationId": "uuid",
  "sourceMessageId": "uuid",
  "title": "Leaving the park",
  "triggerLabel": "leaving activity",
  "structured": {
    "mode": "hard_moment",
    "situation_summary": "Leaving the park is overwhelming because a fun activity is ending.",
    "parent_tone": "Low voice. Few words.",
    "regulate": {
      "parent_action": "Take one breath and move closer.",
      "script": "I’m here. I won’t let you kick."
    },
    "connect": {
      "parent_action": "Name the feeling simply.",
      "script": "You really wanted to stay."
    },
    "guide": {
      "parent_action": "Set the limit and next step.",
      "script": "We are leaving now. Hold my hand or I will carry you."
    },
    "avoid": [
      "Stop this right now"
    ],
    "notes": [
      "Keep talking minimal."
    ],
    "safety_escalation": false
  },
  "notes": "Worked well after a 5-minute warning."
}
Success Response
Json
Copy code
{
  "id": "uuid",
  "title": "Leaving the park",
  "trigger_label": "leaving activity",
  "created_at": "2026-03-11T10:10:00Z"
}
8. List Saved Scripts
Endpoint
Http
Copy code
GET /functions/v1/list-saved-scripts?childProfileId=<uuid>&limit=20&cursor=<cursor>
Purpose
Lists saved scripts for the authenticated user.
Auth
Required.
Success Response
Json
Copy code
{
  "items": [
    {
      "id": "uuid",
      "title": "Leaving the park",
      "trigger_label": "leaving activity",
      "child_profile_id": "uuid",
      "created_at": "2026-03-11T10:10:00Z"
    }
  ],
  "next_cursor": null
}
9. Delete Saved Script
Endpoint
Http
Copy code
POST /functions/v1/delete-saved-script
Purpose
Deletes a saved script.
Auth
Required.
Request Body
Json
Copy code
{
  "savedScriptId": "uuid"
}
Success Response
Json
Copy code
{
  "success": true,
  "savedScriptId": "uuid"
}
10. Create Child Profile
Endpoint
Http
Copy code
POST /functions/v1/create-child-profile
Purpose
Creates a child profile used for personalization.
Auth
Required.
Request Body
Json
Copy code
{
  "name": "Alex",
  "childAge": 6,
  "neurotype": ["ADHD", "Sensory"],
  "preferences": {
    "preferred_transition_warning_minutes": 5
  }
}
Success Response
Json
Copy code
{
  "id": "uuid",
  "user_id": "uuid",
  "name": "Alex",
  "child_age": 6,
  "neurotype": ["ADHD", "Sensory"],
  "preferences": {
    "preferred_transition_warning_minutes": 5
  },
  "created_at": "2026-03-11T10:00:00Z",
  "updated_at": "2026-03-11T10:00:00Z"
}
11. List Child Profiles
Endpoint
Http
Copy code
GET /functions/v1/list-child-profiles
Purpose
Returns all child profiles for the authenticated user.
Auth
Required.
Success Response
Json
Copy code
{
  "items": [
    {
      "id": "uuid",
      "name": "Alex",
      "child_age": 6,
      "neurotype": ["ADHD"],
      "preferences": {},
      "created_at": "2026-03-11T10:00:00Z",
      "updated_at": "2026-03-11T10:00:00Z"
    }
  ]
}
12. Update Child Profile
Endpoint
Http
Copy code
POST /functions/v1/update-child-profile
Purpose
Updates a child profile.
Auth
Required.
Request Body
Json
Copy code
{
  "childProfileId": "uuid",
  "name": "Alex",
  "childAge": 6,
  "neurotype": ["ADHD", "Sensory"],
  "preferences": {
    "preferred_transition_warning_minutes": 10
  }
}
Success Response
Json
Copy code
{
  "success": true,
  "child_profile": {
    "id": "uuid",
    "name": "Alex",
    "child_age": 6,
    "neurotype": ["ADHD", "Sensory"],
    "preferences": {
      "preferred_transition_warning_minutes": 10
    },
    "updated_at": "2026-03-11T10:20:00Z"
  }
}
13. Delete Child Profile
Endpoint
Http
Copy code
POST /functions/v1/delete-child-profile
Purpose
Deletes a child profile and related user-owned data as defined by retention policy.
Auth
Required.
Request Body
Json
Copy code
{
  "childProfileId": "uuid"
}
Success Response
Json
Copy code
{
  "success": true,
  "childProfileId": "uuid"
}
14. Record Script Feedback
Endpoint
Http
Copy code
POST /functions/v1/record-feedback
Purpose
Captures whether a script helped and stores behavior-learning data.
Auth
Required.
Request Body
Json
Copy code
{
  "childProfileId": "uuid",
  "conversationId": "uuid",
  "messageId": "uuid",
  "triggerLabel": "leaving activity",
  "strategyLabel": "countdown warning",
  "successRating": 4,
  "helped": true,
  "feedbackSource": "explicit",
  "notes": "He calmed down faster when I gave two minutes notice."
}
Success Response
Json
Copy code
{
  "success": true,
  "behavior_pattern_id": "uuid"
}
Notes
This endpoint may:
create a child_behavior_patterns record
create an incident_events record
emit analytics events
15. List Child Insights
Endpoint
Http
Copy code
GET /functions/v1/list-child-insights?childProfileId=<uuid>
Purpose
Returns pattern-based insights for a child.
Auth
Required.
Success Response
Json
Copy code
{
  "childProfileId": "uuid",
  "insights": [
    {
      "type": "common_trigger",
      "title": "Transitions have been difficult recently.",
      "body": "Leaving activities is one of the most common hard moments."
    },
    {
      "type": "effective_strategy",
      "title": "Countdown warnings have helped.",
      "body": "This strategy has worked in several recent situations."
    }
  ]
}
Notes
This endpoint should present observations, not guarantees or medical claims.
16. Sync Subscription
Endpoint
Http
Copy code
POST /functions/v1/sync-subscription
Purpose
Updates backend subscription state from RevenueCat or another provider.
Auth
Required.
Request Body
Json
Copy code
{
  "provider": "revenuecat",
  "customerId": "cust_123",
  "entitlement": "premium",
  "productId": "sturdy_premium_monthly",
  "status": "active",
  "currentPeriodEndsAt": "2026-04-11T00:00:00Z",
  "raw": {
    "example": true
  }
}
Success Response
Json
Copy code
{
  "success": true,
  "subscription": {
    "provider": "revenuecat",
    "entitlement": "premium",
    "status": "active",
    "current_period_ends_at": "2026-04-11T00:00:00Z"
  }
}
17. Get Entitlement
Endpoint
Http
Copy code
GET /functions/v1/get-entitlement
Purpose
Returns current premium access state for the authenticated user.
Auth
Required.
Success Response
Json
Copy code
{
  "entitlement": "premium",
  "status": "active",
  "current_period_ends_at": "2026-04-11T00:00:00Z",
  "features": {
    "ai_chat": true,
    "saved_scripts": true,
    "child_insights": true
  }
}
18. Health Check
Endpoint
Http
Copy code
GET /functions/v1/health
Purpose
Simple service health endpoint.
Auth
Optional, depending on environment.
Success Response
Json
Copy code
{
  "ok": true,
  "service": "sturdy-api",
  "timestamp": "2026-03-11T10:00:00Z"
}
Pagination Contract
Endpoints returning lists should use one consistent pattern.
Response Format
Json
Copy code
{
  "items": [],
  "next_cursor": null
}
Cursor Rules
cursor is opaque to the client
client must not parse cursor structure
if next_cursor is null, there are no more pages
Validation Rules
All endpoints should validate:
UUID shape for ID fields
enum values
required fields
ownership of referenced resources
structured JSON shape where relevant
Invalid input should return:
Http
Copy code
400 Bad Request
or
Http
Copy code
422 Unprocessable Entity
Recommended default: 400.
Safety Routing Contract
Safety logic should happen server-side before normal generation.
Possible Policy Routes
normal_parenting
safety_support
violence_escalation
medical_emergency
fallback_response
Client Behavior
The client should not guess safety level from free text. It should use:
Json
Copy code
{
  "safety_escalation": true
}
and optionally future fields such as:
Json
Copy code
{
  "risk_level": "CRISIS_RISK",
  "policy_route": "safety_support"
}
These can be added later without breaking the main contract.
Rate Limiting
Some endpoints should be rate limited.
Recommended candidates:
chat-parenting-assistant
record-feedback
sync-subscription
Suggested Behavior
On limit exceeded:
Http
Copy code
429 Too Many Requests
Response:
Json
Copy code
{
  "error": {
    "code": "rate_limited",
    "message": "Too many requests. Please try again shortly.",
    "details": {
      "retry_after_seconds": 30
    }
  }
}
Idempotency
For create-like endpoints that may be retried by clients, consider idempotency support.
Suggested candidates:
create-conversation
save-script
record-feedback
sync-subscription
Optional request header:
Http
Copy code
Idempotency-Key: <uuid>
If supported, repeated requests with the same key should not create duplicate records.
Versioning Strategy
Initial versioning can be path-stable with backward-compatible additions.
Current recommendation:
avoid breaking changes where possible
add optional fields instead of changing required ones
introduce /v2/ only when necessary
Example future path:
Text
Copy code
/functions/v2/chat-parenting-assistant
Client Expectations
The mobile client should assume:
AI generation can fail
safety routing may replace normal script generation
some endpoints may require premium access
list endpoints may paginate
response structures are stable when documented
The client should not assume:
messages always return instantly
all errors are retryable
conversations always exist before first message
AI output will include extra undocumented fields
Example Mobile Flow
New Hard Moment
user selects child
client optionally creates conversation
client sends message to chat-parenting-assistant
backend performs:
auth
ownership validation
subscription check
safety classification
prompt build
model call
response validation
persistence
client renders structured result
Example Error Handling Guidance
Retryable
Examples:
network timeout
temporary upstream failure
429 rate_limited
Not Retryable Without User Action
Examples:
401 unauthorized
subscription_required
not_found
validation_failed
Minimum MVP Endpoints
If building the smallest useful production version, the minimum recommended API set is:
POST /functions/v1/chat-parenting-assistant
GET /functions/v1/list-child-profiles
POST /functions/v1/create-child-profile
POST /functions/v1/update-child-profile
GET /functions/v1/get-conversation
GET /functions/v1/list-conversations
POST /functions/v1/record-feedback
POST /functions/v1/sync-subscription
GET /functions/v1/get-entitlement
Summary
The Sturdy API is designed to support:
structured parenting guidance
safety-first routing
child-specific personalization
saved scripts
conversation history
subscription enforcement
future predictive insights
A stable API contract is what makes the product buildable across mobile, backend, and future web surfaces.
