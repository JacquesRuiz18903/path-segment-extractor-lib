# path-segment-extractor-lib

Extracts the directory, basename, filename, and extension components from a path string.

```js
import { extract } from 'path-segment-extractor-lib';

const parts = extract('/usr/local/bin/program');
// { directory: '/usr/local/bin', basename: 'program', filename: 'program', extension: '' }

const hidden = extract('/home/user/.bashrc');
// { directory: '/home/user', basename: '.bashrc', filename: '.bashrc', extension: '' }
```

## Why this exists

Node's `path` module parses paths, but its result mixes concerns — `path.parse` returns a compound object whose fields differ across platforms, and `path.extname` alone won't tell you the basename without a second call. This library gives you four orthogonal components in one call and makes the edge cases explicit rather than platform-dependent.

The trade-off: only `/` is treated as a separator. Windows backslash paths are not handled. This keeps behaviour identical on every platform and makes the output predictable; if you need backslash support, normalize first.

## The edge you will hit

A leading dot in the basename is treated as part of the name, not as an extension separator. So `.bashrc` has basename `.bashrc` and no extension, and `.app.conf` has filename `.app` with extension `.conf`. This matches the Unix shell convention for hidden files. A filename ending in a dot (`noext.`) yields an extension of `.` — the dot is preserved because the extension always includes its leading dot, mirroring `path.extname`.

## Performance

The window keeps a bounded buffer, so `push` is constant time and memory does not
grow with the length of the stream. `peak` and `trough` are linear in the window
size, which is the trade that keeps `push` cheap.

## Design notes

The window stores values eagerly rather than keeping running aggregates. Running
sums drift with floating point over long streams, and recomputing from a small
buffer is cheap enough that the drift is not worth the speed.

