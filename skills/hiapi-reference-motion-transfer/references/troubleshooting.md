# Troubleshooting

## Diagnose Before Retrying

Repeated generations cost credits. Change one variable at a time and reuse `--seed` when comparing prompt changes.

| Symptom | Likely cause | First correction |
|---|---|---|
| Action order is wrong | Too many actions or an unclear source | Crop to one action and use `motion` mode |
| Hands or limbs deform | Occlusion, fast blur, or complex contact | Use clearer full-body footage and shorten the clip |
| Camera path is ignored | Subject action competes with camera guidance | Use `camera` mode and remove extra camera words |
| Timing drifts | Output duration differs from useful source interval | Match `--seconds` to the reference segment |
| Subject identity drifts | Text-only identity description is weak | Add one or more authorized reference images |
| Original performer remains | Reference-guided replacement was not followed consistently | Verify `--mode replace`, use a transparent/clean subject image or multiple views, and allow at most one simplified paid retry before changing workflows |
| Background changes during replacement | Replacement-image scenery leaked or the model did not follow the preservation request | Prepare a transparent cutout or clean subject image and review whether one simplified paid retry is justified |
| Strict replace warns that `--prompt` was ignored | Free-form text could compete with Video 1 | Remove `--prompt`; use `--replacement-subject` only to name the target subject |
| Strict replace rejects `--ratio` or `--seconds` | The override would reframe or retime Video 1 | Use the inherited values, or leave strict replace and choose another mode intentionally |
| Strict replace requests `--confirm-preflight` | The paid command has not been matched to a reviewed dry-run | Rerun with `--dry-run`, show the payload and warnings to the user, wait for explicit paid-generation approval, then pass its token unchanged |
| `HIAPI_API_KEY` is missing | The calling process did not inherit the secret | State that no task was created, offer the applicable setup choices from `references/api.md`, restart the agent after persistent changes, and verify from the same process environment |
| Output orientation differs from Video 1 | Ratio was overridden, unknown, or inferred from competing media | Omit `--ratio` for a local Video 1 so it is inherited; for remote Video 1, provide the source ratio explicitly |
| Orientation conflict warning | Replacement image orientation differs from Video 1 | Continue only if the subject remains usable after reframing; otherwise crop or prepare a better subject image |
| Local video is rejected before submission | Metadata is unreadable or FFmpeg is unavailable | Install FFmpeg or set `HIAPI_FFMPEG_PATH`; optionally set `HIAPI_FFPROBE_PATH`, then verify the source can be decoded |
| Local video requires normalization | Codec or pixel format is incompatible | Allow the preflight to transcode it to H.264 with `yuv420p`; inspect the normalized file before submission if fidelity is critical |
| Animal moves like a distorted human | Literal cross-species pose copying | Keep action intent but require anatomically plausible gait and contact points |
| Product shape changes | Motion is too aggressive or product is obscured | Reduce subject motion and use a clean product image |
| Multiple references conflict | No explicit primary reference | Make Video 1 primary and narrow later references |
| Strict replace rejects extra media | Additional video, ordinary reference image, or separate reference audio would create a second source of truth | Keep exactly one Video 1 and only replacement-subject images |
| Task returns HTTP 400 | Invalid combination or limits | Check durations, counts, ratio, resolution, and media mode |
| Polling times out | Video remains queued or running | Keep the task ID and check it later; do not resubmit immediately |
| Task reports `generated_unreviewed` | API generation completed but semantics were not checked | Watch the full output and complete every item in `reviewChecklist` before describing replacement as passed |

## Retry Order

1. Remove secondary references.
2. Shorten the useful reference segment.
3. Select one focused transfer mode.
4. For `replace`, remove `--prompt` entirely. For other modes, simplify the requested scene.
5. Add a subject reference image if identity matters.
6. Lower resolution for iteration; return to the target resolution after the prompt stabilizes.

## When To Stop

Stop using this workflow when the requirement is guaranteed hard replacement, frame-perfect pose matching, exact joint trajectories, production motion-capture retargeting, deterministic lip synchronization, or editing pixels in the original video. Use a model or pipeline with explicit source/target subject roles, masks or segmentation, pose/motion controls, compositing, mocap, animation, or video editing instead.

Do not repeatedly spend credits trying to turn a prompt-guided reference model into a deterministic replacement system. A second clean view may improve consistency, but it does not add a hard replacement contract.
