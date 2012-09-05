import time
import json
from socketio.namespace import BaseNamespace

import snostream

class ScreamersNamespace(BaseNamespace):
    _registry = {}

    def initialize(self, subscriptions=[]):
        print 'connection', id(self)
        ScreamersNamespace._registry[id(self)] = self
        self.last_screamers = []
        self.avg = []
        self.avg_no_screamers = []
        self.screamer_thresh = 800
        for crate in range(19):
          self.last_screamers.append(0)
          self.avg.append(0)
          self.avg_no_screamers.append(0)

    def on_screamersread(self, packet):
        print 'initializing screamers'
        if 'ack' in packet:
            l = []
            for i in range(19):
              l.append({'id': i, 'screamers': 0, 'avg': 0, 'avgno': 0})
        return [None,l]

    def recv_disconnect(self):
        print 'DISCONNECT', id(self)
        del ScreamersNamespace._registry[id(self)]
        self.disconnect(silent=True)

    @classmethod
    def update_trigger(self):
        for s in ScreamersNamespace._registry.values():
            print 'updating screamers'
            l = []
            for crate in range(19):
                screamers = 0
                avg = 0
                avgno = 0
                for channel in range(512):
                    update = snostream.data_store.get_latest('cmos_rates_%i' % (channel+512*crate))
                    avg += update[1]
                    if update[1] > s.screamer_thresh:
                        screamers+=1
                    else:
                        avgno += update[1]
                avg = int(avg/512)
                avgno = int(avgno/(512-screamers))

                if screamers != s.last_screamers[crate] or avg != s.avg[crate] or avgno != s.avg_no_screamers[crate]:
                    s.last_screamers[crate] = screamers
                    s.avg[crate] = avg
                    s.avg_no_screamers[crate] = avgno
                    address = 'screamers/%i:update' % crate
                    s.emit(address,{'id':crate,'screamers':screamers, 'avg':avg, 'avgno':avgno})
                else:
                    print 'all the same'


class CMOSRatesNamespace(BaseNamespace):
    _registry = {}

    def initialize(self, subscriptions=[]):
        print 'connection', id(self)
        CMOSRatesNamespace._registry[id(self)] = self
        self.last_update = time.time()
        self.crate = 0

    def on_setcrate(self, data):
        print 'crate set to ',int(data['crate'])
        self.crate = int(data['crate'])
        self.last_update = time.time()

    def on_cmosratesread(self, packet):
        print 'initializing cmosrates'
        if 'ack' in packet:
            l = []
            for i in range(512):
                l.append({'id': i, 'rate': 0})
        return [None,l]

    def recv_disconnect(self):
        print 'DISCONNECT', id(self)
        del CMOSRatesNamespace._registry[id(self)]
        self.disconnect(silent=True)

    @classmethod
    def update_trigger(self):
        for s in CMOSRatesNamespace._registry.values():
          print 'updating crate ',s.crate
          data = {'update': []}
          for channel in range(512):
              update = snostream.data_store.get_latest('cmos_rates_%i' % (s.crate*512+channel),s.last_update)
              if update is not None:
                  data['update'].append({'id':channel,'rate':int(round(update[1],0))})
          if len(data['update']) > 0:
              s.emit('cmosrates:update',data);
          s.last_update = time.time()


class ChannelRatesNamespace(BaseNamespace):
    _registry = {}

    def initialize(self, subscriptions=[]):
        print 'connection', id(self)
        ChannelRatesNamespace._registry[id(self)] = self
        self.last_update = time.time()
        self.channel = None

    def on_channelratesread(self, data):
        print 'initializing channel ',data['id']
        self.channel = data['id']
        interval = (time.time()-50, time.time())
        updates = snostream.data_store.get('cmos_rates_%i' % data['id'], interval)
        self.last_update = time.time()
        if len(updates) > 0:
            address = 'channelrates/%i:update' % data['id']
            self.emit(address, updates)

    def recv_disconnect(self):
        print 'DISCONNECT', id(self)
        del ChannelRatesNamespace._registry[id(self)]
        self.disconnect(silent=True)
              

    @classmethod
    def update_trigger(self):
        for s in ChannelRatesNamespace._registry.values():
          if s.channel is None:
            continue
          print 'updating channel ', s.channel
          update = snostream.data_store.get_latest('cmos_rates_%i' % s.channel,s.last_update)
          print update
          if update is not None:
            address = 'channelrates/%i:update' % s.channel
            s.emit(address,[update]);
          s.last_update = time.time()


