import time
import json
from socketio.namespace import BaseNamespace

import snostream

class ScreamersNamespace(BaseNamespace):
    _registry = {}

    def on_initialize(self, subscriptions=[]):
        ScreamersNamespace._registry[id(self)] = self
        print 'INIT', id(self)

    def on_screamerread(self, data, callback):
        list = []
        for i in range(0,19):
            list.push_back({id: i, screamers: 0})

        callback(null, list)

