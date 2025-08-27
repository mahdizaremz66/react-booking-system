import json

def flatten(d, p=''):
    r = {}
    for k, v in d.items():
        if isinstance(v, dict):
            r.update(flatten(v, p + k + '.'))
        else:
            r[p + k] = v
    return r

with open('frontend/src/locales/fa.json', encoding='utf-8') as f:
    fa = json.load(f)
with open('frontend/src/locales/en.json', encoding='utf-8') as f:
    en = json.load(f)

fa_keys = set(flatten(fa).keys())
en_keys = set(flatten(en).keys())

only_fa = fa_keys - en_keys
only_en = en_keys - fa_keys

print('کلیدهایی که فقط در fa هستند:', only_fa)
print('کلیدهایی که فقط در en هستند:', only_en) 