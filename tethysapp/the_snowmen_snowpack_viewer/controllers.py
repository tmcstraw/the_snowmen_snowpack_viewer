from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from tethys_sdk.gizmos import LinePlot
from tethys_sdk.gizmos import Button
from tethys_sdk.gizmos import DatePicker
from tethys_sdk.gizmos import TimeSeries
from tethys_sdk.gizmos import SelectInput
from datetime import datetime
import csv, os
import random
import string
from tethys_sdk.services import get_spatial_dataset_engine
import urlparse


@login_required()
def home(request):
    """
    Controller for the app home page.
    """


    return render(request, 'the_snowmen_snowpack_viewer/home.html')

def mapview(request):
    """
    Controller for the app home page.
    """

    date_picker_initial = DatePicker(name='date1',
                                     display_text='Initial Date',
                                     autoclose=True,
                                     format='MM d, yyyy',
                                     start_date='1/1/2000',
                                     start_view='decade',
                                     today_button=False,
                                     initial='January 1, 2018')

    date_picker_final = DatePicker(name='date2',
                                   display_text='Final Date',
                                   autoclose=True,
                                   format='MM d, yyyy',
                                   start_date='1/2/2000',
                                   start_view='decade',
                                   today_button=True,
                                   initial='March 1, 2018')

    select_input = SelectInput(display_text='Download',
                               name='select1',
                               multiple=False,
                               original=True,
                               options=[('As txt', '1'), ('As csv', '2'), ('As xls', '3')],
                               initial=['As txt'])

    timeseries_plot = TimeSeries(
        height='500px',
        width='500px',
        engine='highcharts',
        title='Irregular Timeseries Plot',
        y_axis_title='Snow depth',
        y_axis_units='m',
        series=[{
            'name': 'Winter 2007-2008',
            'data': [
                [datetime(2008, 12, 2), 0.8],
                [datetime(2008, 12, 9), 0.6],
                [datetime(2008, 12, 16), 0.6],
                [datetime(2008, 12, 28), 0.67],
                [datetime(2009, 1, 1), 0.81],
                [datetime(2009, 1, 8), 0.78],
                [datetime(2009, 1, 12), 0.98],
                [datetime(2009, 1, 27), 1.84],
                [datetime(2009, 2, 10), 1.80],
                [datetime(2009, 2, 18), 1.80],
                [datetime(2009, 2, 24), 1.92],
                [datetime(2009, 3, 4), 2.49],
                [datetime(2009, 3, 11), 2.79],
                [datetime(2009, 3, 15), 2.73],
                [datetime(2009, 3, 25), 2.61],
                [datetime(2009, 4, 2), 2.76],
                [datetime(2009, 4, 6), 2.82],
                [datetime(2009, 4, 13), 2.8],
                [datetime(2009, 5, 3), 2.1],
                [datetime(2009, 5, 26), 1.1],
                [datetime(2009, 6, 9), 0.25],
                [datetime(2009, 6, 12), 0]
            ]
        }]
    )

    bufferPoint_button = Button(
        display_text='Buffer Point',
        name='bufferPoint-button',
        icon='',
        style='',
        attributes={
            'data-toggle': 'tooltip',
            'data-placement': 'top',
            'title': ''
        }
    )

    delineateWatershed_button = Button(
        display_text='Delineate Watershed',
        name='delineateWatershed-button',
        icon='',
        style='',
        attributes={
            'data-toggle': 'tooltip',
            'data-placement': 'top',
            'title': ''
        }
    )

    modisData_button = Button(
        display_text='MODIS Data',
        name='modisData-button',
        icon='',
        style='',
        attributes={
            'data-toggle': 'tooltip',
            'data-placement': 'top',
            'title': ''
        }
    )

    interpolateSnowPack_button = Button(
        display_text='Interpolate Snow Pack',
        name='interpolateSnowPack-button',
        icon='',
        style='',
        attributes={
            'data-toggle': 'tooltip',
            'data-placement': 'top',
            'title': ''
        }
    )

    context = {
        'date_picker_initial': date_picker_initial,
        'date_picker_final': date_picker_final,
        'select_input': select_input,
        'timeseries_plot': timeseries_plot,
        'bufferPoint_button': bufferPoint_button,
        'delineateWatershed_button': delineateWatershed_button,
        'modisData_button': modisData_button,
        'interpolateSnowPack_button': interpolateSnowPack_button
    }

    return render(request, 'the_snowmen_snowpack_viewer/mapview.html', context)

def data_services(request):
    """
    Controller for the app home page.
    """


    return render(request, 'the_snowmen_snowpack_viewer/data_services.html')

def about(request):
    """
    Controller for the app home page.
    """

    return render(request, 'the_snowmen_snowpack_viewer/about.html')

def proposal(request):
    """
    Controller for the app home page.
    """

    return render(request, 'the_snowmen_snowpack_viewer/proposal.html')

def mockup(request):
    """
    Controller for the app home page.
    """

    return render(request, 'the_snowmen_snowpack_viewer/mockup.html')

def animation(request):

    time_series_plot = LinePlot(
    height='500px',
    width='500px',
    engine='highcharts',
    title='Change in Snowpack',
    subtitle='Plot Subtitle',
    spline=True,
    x_axis_title='Time',
    x_axis_units='Month',
    y_axis_title='Depth',
    y_axis_units='Inches',
    series=[
       {
           'name': 'Snowpack Change',
           'color': '#0066ff',
           'marker': {'enabled': False},
           'data': [
               [0, 5], [10, -70],
               [20, -86.5], [30, -66.5],
               [40, -32.1],
               [50, -12.5], [60, -47.7],
               [70, -85.7], [80, -106.5]
           ]
       },
    ]
)
    add_region_button = Button(
        display_text='Add Region',
        name='add-region-button',
        icon='glyphicon glyphicon-plus',
        style='success'
    )

    # Date Picker Options
    date_picker = DatePicker(name='date1',
                         display_text='Date',
                         autoclose=True,
                         format='MM d, yyyy',
                         start_date='2/15/2014',
                         start_view='decade',
                         today_button=True,
                         initial='February 15, 2014')

    date_picker_error = DatePicker(name='data2',
                               display_text='Date',
                               initial='10/2/2013',
                               disabled=True,
                               error='Here is my error text.')


    context = {"time_series_plot": time_series_plot,
               "add_region_button": add_region_button,
               'date_picker': date_picker,
            'date_picker_error': date_picker_error,
    }
    return render(request, 'the_snowmen_snowpack_viewer/animation.html', context)

def gpservice(request):
    """
    Controller for the app home page.
    """


    return render(request, 'the_snowmen_snowpack_viewer/gpservice.html')

def modis(request):
    """
    Controller for the app home page.
    """
    time_series_plot = LinePlot(
    height='500px',
    width='500px',
    engine='highcharts',
    title='Change in Snowpack',
    subtitle='Plot Subtitle',
    spline=True,
    x_axis_title='Time',
    x_axis_units='Month',
    y_axis_title='Depth',
    y_axis_units='Inches',
    series=[
       {
           'name': 'Snowpack Change',
           'color': '#0066ff',
           'marker': {'enabled': False},
           'data': [
               [0, 5], [10, -70],
               [20, -86.5], [30, -66.5],
               [40, -32.1],
               [50, -12.5], [60, -47.7],
               [70, -85.7], [80, -106.5]
           ]
       },
    ]
)
    add_region_button = Button(
        display_text='Add Region',
        name='add-region-button',
        icon='glyphicon glyphicon-plus',
        style='success'
    )

    # Date Picker Options
    date_picker = DatePicker(name='date1',
                         display_text='Date',
                         autoclose=True,
                         format='MM d, yyyy',
                         start_date='2/15/2014',
                         start_view='decade',
                         today_button=True,
                         initial='February 15, 2014')

    date_picker_error = DatePicker(name='data2',
                               display_text='Date',
                               initial='10/2/2013',
                               disabled=True,
                               error='Here is my error text.')


    context = {"time_series_plot": time_series_plot,
               "add_region_button": add_region_button,
               'date_picker': date_picker,
            'date_picker_error': date_picker_error,
    }

    return render(request, 'the_snowmen_snowpack_viewer/modis.html')


def region(request):

    date_picker_initial = DatePicker(name='date1',
                                     display_text='Initial Date',
                                     autoclose=True,
                                     format='MM d, yyyy',
                                     start_date='1/1/2000',
                                     start_view='decade',
                                     today_button=False,
                                     initial='January 1, 2018')


    timeseries_plot = TimeSeries(
        height='500px',
        width='500px',
        engine='highcharts',
        title='Irregular Timeseries Plot',
        y_axis_title='Snow depth',
        y_axis_units='m',
        series=[{
            'name': 'Winter 2007-2008',
            'data': [
                [datetime(2008, 12, 2), 0.8],
                [datetime(2008, 12, 9), 0.6],
                [datetime(2008, 12, 16), 0.6],
                [datetime(2008, 12, 28), 0.67],
                [datetime(2009, 1, 1), 0.81],
                [datetime(2009, 1, 8), 0.78],
                [datetime(2009, 1, 12), 0.98],
                [datetime(2009, 1, 27), 1.84],
                [datetime(2009, 2, 10), 1.80],
                [datetime(2009, 2, 18), 1.80],
                [datetime(2009, 2, 24), 1.92],
                [datetime(2009, 3, 4), 2.49],
                [datetime(2009, 3, 11), 2.79],
                [datetime(2009, 3, 15), 2.73],
                [datetime(2009, 3, 25), 2.61],
                [datetime(2009, 4, 2), 2.76],
                [datetime(2009, 4, 6), 2.82],
                [datetime(2009, 4, 13), 2.8],
                [datetime(2009, 5, 3), 2.1],
                [datetime(2009, 5, 26), 1.1],
                [datetime(2009, 6, 9), 0.25],
                [datetime(2009, 6, 12), 0]
            ]
        }]
    )

    submit_region_button = Button(
        display_text='Submit Region',
        name='submit-region-button',
        icon='',
        style='',
        attributes={
            'data-toggle': 'tooltip',
            'data-placement': 'top',
            'title': ''
        }
    )

    draw_polygon_button = Button(
        display_text='Draw Polygon',
        name='draw-polygon-button',
        icon='',
        style='',
        attributes={
            'data-toggle': 'tooltip',
            'data-placement': 'top',
            'title': ''
        }
    )


    context = {
        'date_picker_initial': date_picker_initial,
        'timeseries_plot': timeseries_plot,
        'submit_region_button': submit_region_button,
        'draw_polygon_button': draw_polygon_button,
    }

    return render(request, 'the_snowmen_snowpack_viewer/region.html', context)
