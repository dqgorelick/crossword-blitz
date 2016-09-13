#!/usr/bin/env python

import sqlite3 as lite


def main():
    con = lite.connect('./clues.db')
    cur = con.cursor()
    cur.execute('SELECT * from initial')
    initial_data = cur.fetchall()

    # schema:

    # id integer
    # clue text
    # length integer
    # year integer
    # month integer
    #
    # occurences integer
    # attempt integer
    # correct integer
    # flagged integer

    try:
        cur.execute('DROP TABLE working_table;')
    except lite.OperationalError:
        print('table "working_table" does not exist, moving on...')

    cur.execute('CREATE TABLE working_table(id integer, clue text, word text, length integer, year integer, month integer, occurences integer, attempts integer, correct integer, flagged integer);')

    id = 0
    for item in initial_data:
        word_id = id
        clue = item[0]
        word = item[1]
        length = len(item[1])
        year = item[2]
        month = item[3]
        id += 1

        to_insert = (word_id, clue, word, length, year, month, 0, 0, 0, 0)
        cur.execute('INSERT INTO working_table(id, clue, word, length, year, month, occurences, attempts, correct, flagged) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', to_insert)

    con.commit()

if __name__ == '__main__':
    main()
