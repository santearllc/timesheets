#!/usr/bin/python

from shotgun import Shotgun
from bamboo import Bamboo

# run scripts every 30 mintues

Shotgun().sync()
Shotgun().update_statuses()
Bamboo().sync()	
