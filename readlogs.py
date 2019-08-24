#!/bin/env python3

import json
import re


logPriority = {
	'debug': 0,
	'verbose': 1,
	'info': 2,
	'warn': 3,
	'error': 4
}


def objectifyDict(d: dict):
	return {key: objectify(val) for key, val in d.items()}


def objectifyList(l: list):
	return [objectify(elem) for elem in l]


def objectifyStr(s: str):
	try:
		i = s.find('{')
		if i == -1:
			i = s.find('[')
		if i != -1:
			return objectify(json.loads(s[i:]))
	except: pass
	return s


typeSwitcher = {
	dict: objectifyDict,
	list: objectifyList,
	str: objectifyStr
}


def objectify(obj):
	return typeSwitcher.get(type(obj), lambda x: x)(obj)


def main(*args, **kwargs):

	level = kwargs.get('level', 'debug')
	levelPriority = logPriority.get(level, 0)

	with open(kwargs['file'], 'r') as f:
		data = []
		for j in f.read().split('\n'):
			if j:
				obj = json.loads(j)
				obj = objectify(obj)
				if logPriority[obj['level']] >= levelPriority:
					data.append(obj)

	print(json.dumps(data, ensure_ascii=False, indent='  '))

	return 0


def run():
	from sys import argv

	args, kwargs = [], {}

	i = 0
	while i != len(argv):
		arg = argv[i]
		match = re.match(r'^--([a-zA-Z]+)$', arg)
		if match:
			key, val = match.groups()[0], argv[i+1]
			kwargs[key] = val
			i += 1
		else:
			args.append(arg)
		i += 1

	print(f'Running with\nargs={args}\nkwargs={kwargs}')
	exitCode = main(*args, **kwargs)
	exit(exitCode)


if __name__ == '__main__':
	run()