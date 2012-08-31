import time
import json
from socketio.namespace import BaseNamespace

import snostream

class ScreamersNamespace(BaseNamespace):
    _registry = {}

    def initialize(self, subscriptions=[]):
        print 'connection', id(self)
        ScreamersNamespace._registry[id(self)] = self
        self.last_update = time.time()

    def on_screamersread(self, packet):
        print 'initializing screamers'
        if 'ack' in packet:
            print packet['ack']
            print packet['id']
            list = []
            for i in range(0,19):
                list.append({'id': i, 'screamers': 0})
        return [None,list]

    @classmethod
    def update_trigger(self):
        print 'update trigger'
        for s in ScreamersNamespace._registry.values():
            l = []
            for channel in range(0,19):
                update = snostream.data_store.get_latest('cmos_rates_%i' % channel,s.last_update)
                if update is not None:
                    address = 'screamers/%i:update' % channel
                    s.emit(address,{'id':channel,'screamers':int(round(update[1],0))})
            s.last_update = time.time()


class CMOSRatesNamespace(BaseNamespace):
    _registry = {}

    def initialize(self, subscriptions=[]):
        print 'connection', id(self)
        CMOSRatesNamespace._registry[id(self)] = self
        self.last_update = time.time()

    def on_cmosratesread(self, packet):
        print 'initializing cmosrates'
        if 'ack' in packet:
            print packet['ack']
            print packet['id']
            list = []
            for i in range(0,512):
                list.append({'id': i, 'rate': 0})
        return [None,list]

    @classmethod
    def update_trigger(self):
        print 'update trigger'
        for s in CMOSRatesNamespace._registry.values():
          data = {'update': []}
          for channel in range(0,512):
              update = snostream.data_store.get_latest('cmos_rates_%i' % channel,s.last_update)
              if update is not None:
                  data['update'].append({'id':channel,'rate':int(round(update[1],0))})
          s.emit('cmosrates:update',data);
          s.last_update = time.time()


