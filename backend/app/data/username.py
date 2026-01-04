import random

with open("./data/adjectives.txt") as fp:
    adj_list = fp.readlines()
with open("./data/nouns.txt") as fp:
    nouns_list = fp.readlines()


def generate_username():
    adj = random.choice(adj_list).removesuffix('\n')
    noun = random.choice(nouns_list).removesuffix('\n')
    number = random.randint(1,9999)
    return adj + noun.capitalize() + str(number)
