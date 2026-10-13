/**
 * A path's last extension is the substring from the LAST dot to the
 * end. Leading dots in the basename (hidden files on Unix) are
 * intentionally NOT treated as extensions — that matches the shell
 * convention where ".bashrc" has a basename of ".bashrc" and no
 * extension.
 *
 * The extension INCLUDES the dot. This is the behaviour of Node's
 * `path.extname`, and we keep it so the two can be swapped without
 * surprise.
 *
 * Trailing slashes are collapsed before splitting. A path that ends
 * with a separator has no filename, so its filename is the empty
 * string, not the empty segment before the slash.
 */
const SEP = '/';

/**
 * @param {string} path
 * @returns {{directory: string, basename: string, filename: string, extension: string}}
 */
export function extract(path) {
  if (typeof path !== 'string') {
    throw new TypeError(`extract() expected a string, got ${path === null ? 'null' : typeof path}`);
  }

  let directory = '';
  let basename = '';

  const lastSep = path.lastIndexOf(SEP);
  if (lastSep === -1) {
    // No directory component at all. Leave directory empty rather
    // than emitting "./" so the caller can distinguish "file.txt"
    // from "./file.txt" if they ever need to.
    basename = path;
  } else {
    directory = path.slice(0, lastSep);
    basename = path.slice(lastSep + 1);
  }

  // A trailing slash means "this path names a directory, not a file."
  // The filename is therefore empty.
  if (basename === '') {
    return { directory, basename: '', filename: '', extension: '' };
  }

  const lastDot = basename.lastIndexOf('.');
  let filename;
  let extension;

  if (lastDot <= 0) {
    // lastDot === -1: no dot at all, no extension.
    // lastDot === 0: leading dot (hidden file), not an extension.
    filename = basename;
    extension = '';
  } else {
    filename = basename.slice(0, lastDot);
    extension = basename.slice(lastDot);
  }

  return { directory, basename, filename, extension };
}
