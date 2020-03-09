// parse otpauth://
// https://gitlab.com/dominicp/otpauth-uri-parser/-/blob/master/index.js
/**
 * This function takes an otpauth:// style key URI and parses it into an object with keys for the
 * various parts of the URI
 *
 * @param {String} uri The otpauth:// uri that you want to parse
 *
 * @return {Object} The parsed URI or null on failure. The URI object looks like this:
 *
 * {
 *  type: 'totp',
 *  label: { issuer: 'ACME Co', account: 'jane@example.com' },
 *  query: {
 *   secret: 'JBSWY3DPEHPK3PXP',
 *   digits: '6'
 *  }
 * }
 *
 * @see <a href="https://github.com/google/google-authenticator/wiki/Key-Uri-Format">otpauth Key URI Format</a>
 */
function parseURI(uri) {

    // Quick sanity check
    if (typeof uri !== 'string' || uri.length < 7) return null;

    // I would like to just use new URL(), but the behavior is different between node and browsers, so
    // we have to do some of the work manually with regex.
    const parts = /otpauth:\/\/([A-Za-z]+)\/([^?]+)\??(.*)?/i.exec(uri);

    if (! parts || parts.length < 3) { return null; }

    // eslint-disable-next-line no-unused-vars
    const [fullUri, type, fullLabel] = parts;

    // Sanity check type and label
    if (! type || ! fullLabel) { return null; }

    // Parse the label
    const decodedLabel = decodeURIComponent(fullLabel);

    const labelParts = decodedLabel.split(/: ?/);

    const label = labelParts && labelParts.length === 2
        ? { issuer: labelParts[0], account: labelParts[1] }
        : { issuer: '', account: decodedLabel };

    // Parse query string
    const qs = parts[3] ? new URLSearchParams(parts[3]) : [];

    const query = [...qs].reduce((acc, [key, value]) => {

        acc[key] = value;

        return acc;

    }, {});

    // Returned the parsed parts of the URI
    return { type: type.toLowerCase(), label, query };
}
