# Generated by Django 3.0.3 on 2020-02-19 01:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('StreetCardServices', '0009_auto_20200219_0148'),
    ]

    operations = [
        migrations.AlterField(
            model_name='homeless',
            name='PersonalId',
            field=models.CharField(max_length=32, primary_key=True, serialize=False, unique=True),
        ),
    ]
