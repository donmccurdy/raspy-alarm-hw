# raspy-alarm-hw

Hardware controller for an alarm clock running on a raspberry pi.

To get the `node-speaker` package working on a Pi, the ALSA package must be installed:

```bash
$ sudo apt-get install libasound2-dev
```

## Notes

If the Raspberry Pi is showing Universal rather than Local time, try `dpkg-reconfigure tzdata` as root. I also reinstalled NTPD, which may have been part of the fix.
