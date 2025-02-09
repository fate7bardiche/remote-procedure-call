import math
import re
import json

def floor(argList: list[str], argTypeList: list[str]):
  valid_arg_type("1", argTypeList[0], number_type_list)

  x = float(argList[0])
  return math.floor(x)

def nroot(argList: list[str], argTypeList: list[str]):
  valid_arg_type("1", argTypeList[0], int_type_list)
  valid_arg_type("2", argTypeList[1], int_type_list)

  n = int(argList[0])
  x = int(argList[1])
  return math.pow(x, 1/n)

def reverse(argList: list[str], argTypeList: list[str]):
  valid_arg_type("1", argTypeList[0], str_type_list)
  return reverse_helper(argList[0], "", len(argList[0]) - 1)

def reverse_helper(s: str, res: str, count):
  if(len(s) == len(res)): return res
  return reverse_helper(s, res + s[count], count - 1)
   
def valid_anagram(argList: list[str], argTypeList: list[str]):
  valid_arg_type("1", argTypeList[0], str_type_list)
  valid_arg_type("2", argTypeList[1], str_type_list)

  parsed_arg_1 = json.loads(argList[0])
  parsed_arg_2 = json.loads(argList[1])
  repatter = re.compile(r'\s+')
  s1 = repatter.sub("", parsed_arg_1.lower())
  s2 = repatter.sub("", parsed_arg_2.lower())

  if not len(s1) == len(s2): return False

  hashmap_1 = {}
  hashmap_2 = {}
  for i in range(len(s1)):
      target_1 = s1[i]
      target_2 = s2[i]
      if not target_1 in hashmap_1: hashmap_1[target_1] = 0
      hashmap_1[target_1] += 1
      if not target_2 in hashmap_2: hashmap_2[target_2] = 0
      hashmap_2[target_2] += 1
      
  for key, value in hashmap_1.items():
      if not key in hashmap_2: return False
      if not value == hashmap_2[key]: return False
  return True

def sort(argList: list[str], argTypeList: list[str]):
  valid_arg_type("1", argTypeList[0], str_array_type_list)
  return sorted(json.loads(argList[0]))


method_dict: dict[str, callable] = {
  "floor": floor,
  "nroot": nroot,
  "reverse": reverse,
  "valid_anagram":valid_anagram,
  "sort": sort
}

number_type_list = ["double", "float", "int"]
int_type_list = ["int"]
floating_decimal_list = ["double", "float"]
str_type_list = ["str", "string"]
str_array_type_list = ["str[]", "string[]"]

def valid_arg_type(args_index: str, type: str, expect_type_list: list[str]):
  if (not type in expect_type_list):
    raiseError(args_index, type, expect_type_list)

def raiseError(n: str, type: str, expect_type_list: list[str]):
  raise TypeError(f'第{n}引数の型は{type}でした。しかし想定と異なります。次の型のいずれかに該当する値を入力してください。{", ".join(expect_type_list)}')