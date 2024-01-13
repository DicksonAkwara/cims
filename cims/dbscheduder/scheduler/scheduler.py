import contextlib
from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore, register_events
from apscheduler.triggers.cron import CronTrigger
from django.core.management import call_command

def db_backup():
    with contextlib.suppress(Exception):
        call_command('dbbackup')

def start():
    scheduler=BackgroundScheduler()
    scheduler.add_jobstore(DjangoJobStore(),'default')
    #scheduler.add_job(db_backup,'interval',minutes=1,jobstore='default',id='dailybackup',replace_existing=True)
    scheduler.add_job(
        db_backup,
        trigger='cron', hour='21', minute='53',
        jobstore='default',id='dailybackup',replace_existing=True)
    register_events(scheduler)
    scheduler.start()