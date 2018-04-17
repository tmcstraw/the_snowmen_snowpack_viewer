from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from tethys_sdk.gizmos import LinePlot
from tethys_sdk.gizmos import Button
from tethys_sdk.gizmos import ButtonGroup
from tethys_sdk.gizmos import RangeSlider
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



def data_services(request):
    """
    Controller for the app services page.
    """


    return render(request, 'the_snowmen_snowpack_viewer/data_services.html')

def about(request):
    """
    Controller for the app about page.
    """

    return render(request, 'the_snowmen_snowpack_viewer/about.html')

def proposal(request):
    """
    Controller for the app proposal page.
    """

    return render(request, 'the_snowmen_snowpack_viewer/proposal.html')

def mockup(request):
    """
    Controller for the app mockup page.
    """

    return render(request, 'the_snowmen_snowpack_viewer/mockup.html')

def animation(request):

    """
    Controller for the app animation page.
    """

    # Horizontal Button Group

    select_date = SelectInput(
        display_text='Select a day',
        name='select_date',
        multiple=False,
        original=True,
        options=[('January 1, 2017', 'Jan1_2017'),
                 ('January 2, 2017', 'Jan2_2017'),
                 ('January 3, 2017', 'Jan3_2017'),
                 ('January 4, 2017', 'Jan4_2017'),
                 ('January 5, 2017', 'Jan5_2017'),
                 ('January 6, 2017', 'Jan6_2017'),
                 ('January 7, 2017', 'Jan7_2017'),
                 ('January 8, 2017', 'Jan8_2017'),
                 ('January 9, 2017', 'Jan9_2017'),
                 ('January 10, 2017', 'Jan10_2017'),
                 ('January 11, 2017', 'Jan11_2017'),
                 ('January 12, 2017', 'Jan12_2017'),
                 ('January 13, 2017', 'Jan13_2017'),
                 ('January 14, 2017', 'Jan14_2017'),
                 ('January 15, 2017', 'Jan15_2017'),
                 ('January 16, 2017', 'Jan16_2017'),
                 ('January 17, 2017', 'Jan17_2017'),
                 ('January 18, 2017', 'Jan18_2017'),
                 ('January 19, 2017', 'Jan19_2017'),
                 ('January 20, 2017', 'Jan20_2017'),
                 ('January 21, 2017', 'Jan21_2017'),
                 ('January 22, 2017', 'Jan22_2017'),
                 ('January 23, 2017', 'Jan23_2017'),
                 ('January 24, 2017', 'Jan24_2017'),
                 ('January 25, 2017', 'Jan25_2017'),
                 ('January 26, 2017', 'Jan26_2017'),
                 ('January 27, 2017', 'Jan27_2017'),
                 ('January 28, 2017', 'Jan28_2017'),
                 ('January 29, 2017', 'Jan29_2017'),
                 ('January 30, 2017', 'Jan30_2017'),
                 ('January 31, 2017', 'Jan31_2017'),
                 ],
        initial=['January 1, 2017']

    )

    view_animation_button = Button(
        display_text='View Animation',
        name='view-animation-button',
        icon='glyphicon glyphicon-play',
        style='',
        attributes={"onclick": "showanimationmodal()"},
    )

    close_modal_button = Button(
        display_text='Close',
        name='close-modal-button',
        icon='glyphicon',
        style='',
        attributes={"onclick": "hideanimationmodal()"},
    )

    context = {
        'close_modal_button': close_modal_button,
        'view_animation_button': view_animation_button,
        'select_date': select_date,
    }


    return render(request, 'the_snowmen_snowpack_viewer/animation.html', context)

def gpservice(request):
    """
    Controller for the app gpservice page.
    """


    return render(request, 'the_snowmen_snowpack_viewer/gpservice.html')

def modis(request):

    """
    Controller for the app modis page.
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
    """
    Controller for the app region page.
    """



    context = {

    }

    return render(request, 'the_snowmen_snowpack_viewer/region.html', context)

def polygontool(request):
    """
    Controller for the app polygon page.
    """

    select_date = SelectInput(
        display_text='Select a day',
        name='select_date',
        multiple=False,
        original=True,
        options=[('January 1, 2017', 'Jan1_2017'),
                 ('January 2, 2017', 'Jan2_2017'),
                 ('January 3, 2017', 'Jan3_2017'),
                 ('January 4, 2017', 'Jan4_2017'),
                 ('January 5, 2017', 'Jan5_2017'),
                 ('January 6, 2017', 'Jan6_2017'),
                 ('January 7, 2017', 'Jan7_2017'),
                 ('January 8, 2017', 'Jan8_2017'),
                 ('January 9, 2017', 'Jan9_2017'),
                 ('January 10, 2017', 'Jan10_2017'),
                 ('January 11, 2017', 'Jan11_2017'),
                 ('January 12, 2017', 'Jan12_2017'),
                 ('January 13, 2017', 'Jan13_2017'),
                 ('January 14, 2017', 'Jan14_2017'),
                 ('January 15, 2017', 'Jan15_2017'),
                 ('January 16, 2017', 'Jan16_2017'),
                 ('January 17, 2017', 'Jan17_2017'),
                 ('January 18, 2017', 'Jan18_2017'),
                 ('January 19, 2017', 'Jan19_2017'),
                 ('January 20, 2017', 'Jan20_2017'),
                 ('January 21, 2017', 'Jan21_2017'),
                 ('January 22, 2017', 'Jan22_2017'),
                 ('January 23, 2017', 'Jan23_2017'),
                 ('January 24, 2017', 'Jan24_2017'),
                 ('January 25, 2017', 'Jan25_2017'),
                 ('January 26, 2017', 'Jan26_2017'),
                 ('January 27, 2017', 'Jan27_2017'),
                 ('January 28, 2017', 'Jan28_2017'),
                 ('January 29, 2017', 'Jan29_2017'),
                 ('January 30, 2017', 'Jan30_2017'),
                 ('January 31, 2017', 'Jan31_2017'),
                 ],
        initial=['January 1, 2017']
    )

    refresh_button = Button(
        display_text='Refresh',
        name='refresh-button',
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

    context = {
        'select_date': select_date,
        'draw_polygon_button': draw_polygon_button,
        'submit_region_button': submit_region_button,
        'refresh_button': refresh_button
    }

    return render(request, 'the_snowmen_snowpack_viewer/polygontool.html', context)

def bufferpointtool(request):
    """
    Controller for the app bufferpointtool.
    """

    date_picker_initial = DatePicker(name='date1',
                                     display_text='Initial Date',
                                     autoclose=True,
                                     format='MM d, yyyy',
                                     start_date='1/1/2000',
                                     start_view='decade',
                                     today_button=False,
                                     initial='January 1, 2018')

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

    context = {
        'date_picker_initial': date_picker_initial,
        'bufferPoint_button': bufferPoint_button,
        'submit_region_button': submit_region_button
    }

    return render(request, 'the_snowmen_snowpack_viewer/bufferpointtool.html', context)

def watershedtool(request):
    """
    Controller for the app watershedtool page.
    """

    select_date = SelectInput(
        display_text='Select a day',
        name='select_date',
        multiple=False,
        original=True,
        options=[('January 1, 2017', 'Jan1_2017'),
                 ('January 2, 2017', 'Jan2_2017'),
                 ('January 3, 2017', 'Jan3_2017'),
                 ('January 4, 2017', 'Jan4_2017'),
                 ('January 5, 2017', 'Jan5_2017'),
                 ('January 6, 2017', 'Jan6_2017'),
                 ('January 7, 2017', 'Jan7_2017'),
                 ('January 8, 2017', 'Jan8_2017'),
                 ('January 9, 2017', 'Jan9_2017'),
                 ('January 10, 2017', 'Jan10_2017'),
                 ('January 11, 2017', 'Jan11_2017'),
                 ('January 12, 2017', 'Jan12_2017'),
                 ('January 13, 2017', 'Jan13_2017'),
                 ('January 14, 2017', 'Jan14_2017'),
                 ('January 15, 2017', 'Jan15_2017'),
                 ('January 16, 2017', 'Jan16_2017'),
                 ('January 17, 2017', 'Jan17_2017'),
                 ('January 18, 2017', 'Jan18_2017'),
                 ('January 19, 2017', 'Jan19_2017'),
                 ('January 20, 2017', 'Jan20_2017'),
                 ('January 21, 2017', 'Jan21_2017'),
                 ('January 22, 2017', 'Jan22_2017'),
                 ('January 23, 2017', 'Jan23_2017'),
                 ('January 24, 2017', 'Jan24_2017'),
                 ('January 25, 2017', 'Jan25_2017'),
                 ('January 26, 2017', 'Jan26_2017'),
                 ('January 27, 2017', 'Jan27_2017'),
                 ('January 28, 2017', 'Jan28_2017'),
                 ('January 29, 2017', 'Jan29_2017'),
                 ('January 30, 2017', 'Jan30_2017'),
                 ('January 31, 2017', 'Jan31_2017'),
                 ],
        initial=['January 1, 2017']
    )

    refresh_button = Button(
        display_text='Refresh',
        name='refresh-button',
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

    context = {
        'delineateWatershed_button': delineateWatershed_button,
        'submit_region_button': submit_region_button,
        'select_date': select_date,
        'refresh_button': refresh_button

    }

    return render(request, 'the_snowmen_snowpack_viewer/watershedtool.html', context)
