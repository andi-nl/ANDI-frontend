import sys, json

sep = ";"

def get_line(lines):
    l = lines.pop(0)
    if isinstance(l, str):
        l = l[:-1].split(sep)
    return l

def stop(titles, line):
    "exit when non-unique identifier is found"
    i = titles.index('category')
    exit('Error: non-unique identifiers in: '+str(line[i:i+2]))

def read_block(titles,lines,concatID):
    json_list = []
    line = get_line(lines)
    identifiers = set()
    while True:
        json_dict = {}
        curr_id = line[0].replace(' ','_')
        if curr_id in identifiers:
            stop(titles, line)
        identifiers.add(curr_id)
        block = []
        new_id = curr_id
        while new_id == curr_id or new_id == "":
            block.append(line[1:])
            if len(lines) > 0:
                line = get_line(lines)
                new_id = line[0]
            else:
                new_id = 'end_of_block'
        json_dict['id'] = curr_id
        json_dict['label'] = block[0][3]
        #json_dict['value'] = ""
        if len(block) > 1 and titles[1][:2] != "ID":
            stop(titles[1], block[0])
        if (len(block) > 1 or block[0][0] != "") and titles[1][:2] == "ID":
            json_dict['children'] = read_block(titles[1:],block,concatID+'.'+curr_id)
        else:
            for i in range(titles.index('lowweb'),len(titles)):
                json_dict[titles[i]] = block[0][i-1]
            #json_dict['concatID'] = '.'.join(concatID.split('.')[2:]+[curr_id])
            json_dict['id'] = '-'.join(concatID.split('.')[2:]+[curr_id])
        json_list.append(json_dict)
        if new_id == 'end_of_block':
            break
    return json_list

lines = open(sys.argv[1]).readlines()
titles = get_line(lines)
print json.dumps(read_block(titles,lines,""), indent = 2, sort_keys=True)

