# Output Handling

HiAPI `seedance-2.0` video generation is asynchronous:

1. `POST /v1/tasks` creates a task and returns `data.taskId`.
2. `GET /v1/tasks/{taskId}` returns task status.
3. When API status is `success`, the generated video URL is usually in `data.output[].url`.

The CLI downloads HTTP(S) video URLs to `outputs/` when possible. API `success` means the generation finished; it does not mean the requested subject replacement was visually successful.

The default polling limit is 120 minutes. If the CLI times out, the remote task may still finish; a timeout is not a cancellation.

Before a strict replacement task exists, `--dry-run` prints `preflightToken`, media metadata, warnings, and a summarized payload. Show them to the user, state that no task was created and no credits were spent, and pause for explicit paid-generation approval. Only then pass the unchanged token through `--confirm-preflight`; a missing or stale token creates no task. The token proves payload equality and is not user consent.

The CLI prints JSON:

```json
{
  "transferMode": "replace",
  "model": "seedance-2.0",
  "taskId": "video_task_123",
  "seconds": "5",
  "resolution": "720p",
  "ratio": "16:9",
  "generateAudio": false,
  "semanticStatus": "generated_unreviewed",
  "reviewRequired": true,
  "reviewChecklist": [
    "Watch the complete clip and confirm the replacement subject matches the supplied subject images throughout.",
    "Confirm the source performer or original main subject is absent in every frame.",
    "Confirm Video 1's scene, props, lighting, framing, composition, and shot structure remain acceptably preserved.",
    "Confirm Video 1's action order, camera movement, timing, and rhythm remain acceptably preserved.",
    "Confirm no replacement-image background leaks into the result and any cross-species movement remains anatomically plausible."
  ],
  "outputs": [
    {
      "kind": "file",
      "value": "/absolute/path/to/outputs/seedance-2-0-20260506-120000.mp4",
      "path": "/absolute/path/to/outputs/seedance-2-0-20260506-120000.mp4",
      "mimeType": "video/mp4",
      "sourceUrl": "https://cdn.example.com/video.mp4"
    }
  ]
}
```

If the video cannot be downloaded, return the remote URL instead.

With `--no-wait`, the task has `semanticStatus: "pending_generation"`; it is not ready for review. A completed or resumed output has `semanticStatus: "generated_unreviewed"`.

## Human Review Gate

For every mode, report the result as generated but unreviewed until a human watches the complete clip. Do not use phrases such as "replacement succeeded", "motion transferred", "camera matched", "fully replaced", or "verified" based only on task status or the presence of an output URL.

The reviewer should confirm:

- the original subject is absent in every frame
- the requested subject remains recognizable and temporally consistent
- Video 1's environment, object layout, composition, action intent, camera path, pacing, and shot structure remain acceptably close
- no replacement-image background has leaked into the output
- contact points, balance, gait, and limb use are plausible for cross-species transfer

For non-replace modes, also review the requested priority directly:

- `motion`: action order, movement direction, pose transitions, and performance timing
- `camera`: framing, camera path, camera speed, and reveal pattern
- `rhythm`: pauses, acceleration, beat timing, and reveal cadence
- `balanced`: overall action, camera, and pacing coherence without claiming frame-exact reproduction

After review, report the observations plainly. This skill does not assign a machine-verified pass state.

## User-Facing Failure Copy

- Missing key: "`HIAPI_API_KEY` is not visible to this process, so no task was created. Choose a current-session, persistent OS, or IDE/CI secret setup from `references/api.md`; do not paste the key here."
- Invalid key: "HiAPI rejected the API key. Check or regenerate it at https://www.hiapi.ai/en/dashboard/api-keys."
- Insufficient balance or quota: "Your HiAPI balance or credits may be insufficient. Add credits or check billing at https://www.hiapi.ai/en/dashboard."
- Invalid request: "Check the duration, resolution, ratio, audio flag, and image URL. Seedance 2.0 supports integer durations from 4 to 15 seconds; 480p, 720p, 1080p, and 4k; and 16:9, 9:16, 1:1, 4:3, 3:4, 21:9, adaptive."
- Rate limited: "The request was rate limited. Wait and retry, or reduce concurrent video requests."
- Task failed: "Try a clearer prompt or a different image."
- Timeout: "The video may still be running. Check the task later; timing out does not cancel it."
- Generated replacement: "Generation completed and requires human visual review. API success does not verify subject replacement."
