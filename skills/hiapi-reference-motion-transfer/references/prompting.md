# Reference Motion Prompting

Use these formulas after the user has supplied the authorized reference media. In `replace` mode, the user supplies a new subject, not a new scene: Video 1 remains the scene source.

## Strict Replace

Use `--mode replace` with `--replacement-image-file` or `--replacement-image-url` when the intent is to change only the main subject. Replacement images are assigned first and referenced as `Image 1+`. If replacement images are present and `--mode` is omitted, the CLI selects `replace` automatically. Supply `--replacement-subject`; strict mode accepts exactly one reference video and rejects ordinary reference images and separate reference audio. Omit `--prompt`: strict mode ignores it with a warning so user text cannot introduce a competing scene, camera, action, or style.

The CLI compiles this model-facing contract internally; it is not user-provided `--prompt` text:

```text
Image 1 defines the requested replacement subject. Replace only the performer or main subject from Video 1 with the subject from Image 1. Request that the source performer never appears. Preserve Video 1's background, environment, object positions, framing, composition, camera path, action order, timing, pacing, and shot structure. Do not invent a new scene, lighting design, camera move, or visual style. Preserve the replacement subject's identity, species, body shape, markings, and proportions.
```

For cross-species transfer, preserve the purpose, direction, sequence, and timing of the action, but adapt gait, balance, contact points, and limb use to plausible target anatomy.

Replacement is still reference-driven generation. The API has no explicit source/target identity binding or subject mask in this workflow, so the prompt requests replacement but cannot guarantee it. A human must review the complete video before the result is described as having passed replacement.

Best replacement inputs:

- one transparent-background cutout, prepared before submission when the original photo contains scenery, or one plainly isolated subject explicitly asserted with `--subject-image-clean`
- at least two complementary views when a single clean cutout is unavailable
- the whole subject visible, with minimal occlusion and motion blur
- no scenic background that could compete with Video 1
- a subject scale and pose that make the target action anatomically plausible

The preflight can detect an alpha channel, but it cannot prove that the background is actually transparent or clean. `--subject-image-clean` is an explicit operator assertion, not an automated segmentation check.

## Motion

Formula without a replacement image:

```text
[New subject and scene]. Use the body action, gesture order, pose transitions, and performance timing from Video 1. Preserve [subject attributes]. Do not copy the source identity, clothing, or background.
```

Best inputs:

- one visible performer
- full body inside the frame
- limited occlusion and motion blur
- one continuous action
- similar output and reference durations
- one or more clear replacement-subject views when identity or species matters

Avoid combining a dance sequence with unrelated camera directions or multiple competing actions.

## Camera

Formula:

```text
[New subject and scene]. Use the framing, camera path, camera speed, and reveal pattern from Video 1. Keep [product or subject] stable. Do not copy source appearance or unrelated action.
```

Name the dominant movement when known: tracking, orbit, dolly in, dolly out, pan, tilt, crane, handheld, or static.

## Rhythm

Formula:

```text
[New subject and scene]. Follow Video 1's action density, pauses, accelerations, beat timing, and reveal cadence. Keep the output duration aligned with the reference interval.
```

If exact music synchronization matters, provide an authorized reference audio clip as well as the video and describe the intended beat events.

## Balanced

Formula:

```text
[New subject and scene]. Use Video 1 as overall temporal guidance for the main action, camera movement, and pacing. Prioritize coherent natural motion over frame-exact imitation.
```

Use balanced mode only when no single dimension dominates. Focused modes usually produce clearer results.

Do not use `balanced` as a fallback for subject-only replacement. Use `replace`, because balanced mode permits broader regeneration of the scene and cinematography.

## Multiple References

Treat Video 1 as primary. State the narrow purpose of later references:

```text
Use the body action from Video 1. Use only the final camera reveal from Video 2. Image 1 defines the new subject.
```

Do not ask the model to average contradictory movements. Shorten or remove secondary references when outputs become unstable.

In `replace`, Video 1 is the only video and the single source of scene, camera, action, and timing. Additional videos, ordinary reference images, and separate reference audio are rejected. Use multiple replacement images only as complementary views of the same target subject.
