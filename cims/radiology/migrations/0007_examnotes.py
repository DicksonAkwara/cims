# Generated by Django 4.1.1 on 2024-01-02 18:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('radiology', '0006_examresult_uuid_no'),
    ]

    operations = [
        migrations.CreateModel(
            name='examnotes',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('radnotes', models.TextField(max_length=400)),
            ],
        ),
    ]
