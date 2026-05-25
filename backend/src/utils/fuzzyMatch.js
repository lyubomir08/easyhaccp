const TRANSLIT = {
    'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ж':'zh','з':'z',
    'и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p',
    'р':'r','с':'s','т':'t','у':'u','ф':'f','х':'h','ц':'ts','ч':'ch',
    'ш':'sh','щ':'sht','ъ':'a','ь':'','ю':'yu','я':'ya',
};

function transliterate(str) {
    return str.split('').map(c => TRANSLIT[c] ?? c).join('');
}

function levenshtein(a, b) {
    const m = a.length, n = b.length;
    const prev = Array.from({ length: n + 1 }, (_, j) => j);
    const curr = new Array(n + 1);
    for (let i = 1; i <= m; i++) {
        curr[0] = i;
        for (let j = 1; j <= n; j++) {
            curr[j] = a[i - 1] === b[j - 1]
                ? prev[j - 1]
                : 1 + Math.min(prev[j], curr[j - 1], prev[j - 1]);
        }
        prev.splice(0, n + 1, ...curr);
    }
    return prev[n];
}

export function normalizeForMatch(s) {
    return transliterate(String(s || '').trim().toLowerCase().replace(/\s+/g, ' '));
}

export function fuzzyMatch(a, b) {
    const na = normalizeForMatch(a);
    const nb = normalizeForMatch(b);
    if (na === nb) return true;
    const shorter = Math.min(na.length, nb.length);
    if (shorter < 3) return na === nb;
    const threshold = shorter <= 5 ? 1 : 2;
    return levenshtein(na, nb) <= threshold;
}
