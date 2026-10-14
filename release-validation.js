'use strict';
// Shared by the actual landing page and Node security tests.
(function exposeReleaseValidation() {
  function validManifest(value) {
    return (
      value &&
      value.schemaVersion === 1 &&
      /^\d+\.\d+\.\d+$/.test(value.version || '') &&
      value.platforms &&
      typeof value.platforms === 'object'
    );
  }
  function repository(value) {
    return (
      typeof value === 'string' &&
      /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?\/[a-zA-Z0-9][a-zA-Z0-9_.-]{0,99}$/.test(value)
    );
  }
  function releasePath(value, filename, manifest) {
    if (
      typeof value !== 'string' ||
      typeof filename !== 'string' ||
      !/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(filename) ||
      !validManifest(manifest)
    )
      return null;
    const hosting = manifest.hosting;
    if (!hosting) return value === `downloads/${filename}` ? value : null;
    if (
      hosting.provider !== 'github-releases' ||
      !repository(hosting.repository) ||
      hosting.tag !== `v${manifest.version}`
    )
      return null;
    const expected = `https://github.com/${hosting.repository}/releases/download/${hosting.tag}/${filename}`;
    // Exact original-string comparison excludes credentials, extra ports,
    // encoded traversal, redirects in queries, fragments and other repositories.
    return value === expected ? value : null;
  }
  function download(manifest, platform) {
    if (!validManifest(manifest) || !['windows', 'android'].includes(platform)) return null;
    const release = manifest.platforms[platform];
    if (
      !release ||
      release.status !== 'available' ||
      typeof release.version !== 'string' ||
      !/^\d+\.\d+\.\d+$/.test(release.version) ||
      (platform === 'windows' && release.version !== manifest.version)
    )
      return null;
    const filename =
      platform === 'windows'
        ? `Tracer-Setup-${release.version}-x64.exe`
        : `Tracer-${release.version}-android-preview.apk`;
    if (
      release.filename !== filename ||
      !/^[a-f0-9]{64}$/.test(release.sha256 || '') ||
      !Number.isSafeInteger(release.sizeBytes) ||
      release.sizeBytes <= 0
    )
      return null;
    const url = releasePath(release.url, filename, manifest);
    const checksumUrl = releasePath(release.checksumUrl, `${filename}.sha256`, manifest);
    return url && checksumUrl
      ? { ...release, url, checksumUrl, external: Boolean(manifest.hosting) }
      : null;
  }
  const api = Object.freeze({ validManifest, releasePath, download });
  if (typeof module === 'object' && module.exports) module.exports = api;
  else globalThis.TracerRelease = api;
})();
