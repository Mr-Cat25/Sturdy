PREDICTIVE_INSIGHTS 

Sturdy Predictive Insights System
Purpose
The Predictive Insights system helps Sturdy learn from past parenting moments and provide helpful early guidance.
Instead of simply responding to individual incidents, Sturdy gradually builds an understanding of patterns such as:
• common triggers
• times of day when struggles occur
• strategies that worked
• strategies that did not help
The goal is to provide early support and pattern-based suggestions, not to make medical or behavioral predictions.
Core Principle
Sturdy should never claim to predict behavior with certainty.
Instead, it should provide insights such as:
"Transitions have been difficult recently. Countdown warnings have helped before."
This approach provides useful support while avoiding unrealistic claims.
System Overview
The Predictive Insights system operates through four stages.
Incident occurs ↓ Parent feedback collected ↓ Incident data stored ↓ Pattern analysis ↓ Insights generated 
These insights can then be surfaced in the app through:
• child insights screen
• contextual prompt suggestions
• weekly summaries
Data Collection
Data is collected through lightweight feedback after each interaction.
Example UI:
Did this help?
👍 Yes
👎 Not really
Optional follow-up questions:
What was happening?
• Bedtime
• Leaving activity
• Sibling conflict
• Hitting
• School refusal
How intense was it?
1 — Mild
2 — Slightly upset
3 — Moderate
4 — Very upset
5 — Full meltdown
This simple feedback loop provides enough information to build meaningful patterns.
Incident Events Table
The system stores incident events in the database.
Example schema:
create table public.incident_events ( id uuid primary key default gen_random_uuid(), child_profile_id uuid not null references public.child_profiles(id) on delete cascade, conversation_id uuid references public.conversations(id) on delete set null, trigger_label text not null, context_label text, time_bucket text, intensity integer check (intensity between 1 and 5), strategy_label text, helped boolean, notes text, created_at timestamptz not null default now() ); 
Key Data Fields
trigger_label
The main situation that caused the difficulty.
Examples:
• bedtime
• leaving activity
• screen time ending
• sibling conflict
• getting dressed
• homework
• transitions
context_label
Optional environmental context.
Examples:
• public place
• school morning
• car ride
• home evening routine
• crowded environment
time_bucket
General time period.
Examples:
• morning
• afternoon
• evening
• bedtime
intensity
Parent perception of escalation.
Range:
1–5 scale
1 = mild frustration
5 = full meltdown
strategy_label
Which approach was used.
Examples:
• countdown warning
• offer two choices
• quiet voice
• physical guidance
• distraction
• movement break
helped
Boolean indicator of effectiveness.
true = parent felt the script helped
false = parent felt it did not help
Pattern Detection
Patterns can be generated through simple aggregation queries.
Example analysis queries.
Most Common Triggers
select trigger_label, count(*) from incident_events where child_profile_id = $1 group by trigger_label order by count desc limit 5; 
Most Effective Strategies
select strategy_label, avg(case when helped then 1 else 0 end) as success_rate from incident_events where child_profile_id = $1 group by strategy_label order by success_rate desc; 
Time-Based Patterns
select time_bucket, count(*) from incident_events where child_profile_id = $1 group by time_bucket order by count desc; 
Insight Generation
Insights should be simple, readable, and supportive.
Example insights:
"Transitions are one of the most common hard moments for Alex."
"Bedtime struggles tend to happen more in the evening."
"Countdown warnings helped in several recent situations."
"Offering two choices appears to reduce escalation."
These insights should be phrased as observations, not guarantees.
Insight UI Examples
Example card shown in the Child screen.
Sturdy Insight Transitions have been difficult recently. What helped before: • countdown warnings • offering two choices Suggestion: Try a 5 minute warning before leaving activities. 
Early Support Suggestions
When the system detects a common trigger approaching, it can provide early support.
Example:
If multiple incidents involve leaving activities:
Suggestion before the next event:
"Leaving activities has been hard recently. Try giving a 5 minute warning before leaving."
This provides preventative support without claiming prediction.
Weekly Insights (Future Feature)
The system can generate weekly summaries.
Example:
Weekly Insight Alex had more difficulty with transitions this week. Strategies that helped most: • countdown warnings • offering choices Consider using a short transition routine before leaving activities. 
Risk Scoring (Optional Enhancement)
A simple rule-based scoring system can estimate the likelihood of escalation.
Example logic:
risk_score = 0 if trigger == "transitions" then risk_score += 2 if time_bucket == "evening" then risk_score += 1 if similar_incidents_last_week >= 3 then risk_score += 2 if strategy_missing_last_time then risk_score += 1 
Risk categories:
0–1 Low
2–3 Moderate
4+ Elevated
The system should use this only to suggest preparation strategies.
Data Privacy Considerations
Incident data may include sensitive family information.
Therefore:
• store only necessary data
• avoid storing personal identifiers in notes
• allow deletion of child data
• allow parents to clear incident history
• follow privacy policies outlined in PRIVACY_POLICY.md
Guardrails
The Predictive Insights system must not:
• claim to predict behavior with certainty
• label children with diagnoses
• replace professional behavioral evaluation
• imply guaranteed outcomes
All insights should remain supportive observations.
Future Improvements
Potential enhancements include:
• automated pattern summaries
• seasonal pattern detection
• improved strategy recommendation ranking
• caregiver-specific strategy tracking
• cross-child household insights
• adaptive prompt personalization
These features should be introduced gradually as data quality improves.
Summary
The Predictive Insights system allows Sturdy to evolve from:
AI script generator
into
a parenting support system that learns patterns and provides proactive guidance.
By collecting lightweight feedback and analyzing patterns over time, Sturdy can help parents:
• recognize recurring challenges
• identify strategies that work
• prepare for difficult moments
• feel more confident and supported