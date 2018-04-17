from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import numpy as np
import csv, os
from datetime import datetime, date, time, timedelta
import calendar

@csrf_exempt
def get_time_series(request):

    codEstacion = int(request.POST.get("stationcode"))
    codEstacion = str(codEstacion)

    dir_base = os.path.dirname(__file__)
    url = os.path.join(dir_base, 'public/Snow_Depth_Data', codEstacion + '.csv')

    with open(url) as csvfile:
        readCSV = csv.reader(csvfile, delimiter=',')
        dates = []
        data = []
        for row in readCSV:
            if len(row[1]) > 0:
                da = row[0]
                da = datetime.strptime(da, '%m/%d/%y')
                dat = row[1]
                dates.append(da)
                data.append(dat)
        del da
        del dat
        print(dates)

    datos = []
    dateseconds = []
    for i in range(0, len(dates) - 1):
        seconds = ((dates[i]-datetime(1970,1,1)).total_seconds())*1000
        dateseconds.append(seconds)
        da = [dateseconds[i], int(data[i])]
        datos.append(da)

    time_series = {"time_series": datos}
    #time_series2 = time_series["time_series"]
    #print(time_series2)


    return JsonResponse(time_series)