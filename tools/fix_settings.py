import json, re

path = '/workspace/public/apps/system/settings.eapp'
d = json.load(open(path, encoding='utf-8'))
code = d['code']
m = re.search(r'(<script[^>]*>)(.*?)(</script>)', code, re.S)
s = m.group(2).replace("\\'", "'")  # layer 1: remove double-corruption \' -> '

def fix_literal(match):
    lit = match.group(0)
    inner = lit[1:-1]
    inner = inner.replace('\\"', '"')
    # encode bare ' inside HTML attribute values (value ends at the literal's closing quote)
    def attr_repl(mm):
        val = mm.group(2)
        if "'" in val:
            return mm.group(1) + val.replace("'", "&#39;") + "'"
        return mm.group(0)
    inner = re.sub(r'(=")([^']*?)\'', attr_repl, inner)
    inner = inner.replace("'", "\\'")
    return "'" + inner + "'"

fixed = re.sub(r"'(?:[^'\\]|\\.)*'", fix_literal, s)
fixed = fixed.replace('ePad 10.1"', 'ePad 10.1\u201D')

# sanity checks on generated JS
assert "onclick=\"showIPhoneSection(&#39;device&#39;)\"" in fixed or "showIPhoneSection(&#39;device&#39;)" in fixed, 'device handler not encoded'
assert fixed.count("toggleSetting(&#39;") >= 5, 'toggle handlers not encoded'

code_fixed = code[:m.start(2)] + fixed + code[m.end(2):]
d['code'] = code_fixed
json.dump(d, open(path, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
open('/tmp/s6.js', 'w', encoding='utf-8').write(fixed)
print('written OK, len', len(fixed))
