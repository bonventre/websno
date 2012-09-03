'''Sends fake CMOS rates for testing'''

import zmq
import random
import time

context = zmq.Context()
socket = context.socket(zmq.REQ)
socket.bind('tcp://*:5028')

while True:
    d = {
        'type': 'cmos_rates',
        'channels': []
    }
    
    for i in range(9728):
        d['channels'].append({
            'id': i,
            'rate': max(0, random.normalvariate(500, 200))
        })

    socket.send_json(d)

    reply = socket.recv_json()

    if not reply or 'ok' not in reply:
        print 'communication error'
        break

    print 'send'
    time.sleep(1)

