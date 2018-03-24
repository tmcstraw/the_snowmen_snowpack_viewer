from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from tethys_sdk.gizmos import SelectInput, Button, LinePlot, DatePicker

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
    select_region = SelectInput(display_text='Select a Region:',
                           name='select-region',
                           multiple=False,
                           original=True,
                           options=[('Utah Valley', '1'), ('Payson/Santaquin', '2'), ('Salt Lake ', '3'), ('Ogden', '4')],
                           initial=['']
    )

    select_region_button = Button(
        display_text='Select Region',
        name='select-region-button',
        icon='glyphicon glyphicon-plus',
        style='success',

    )

    add_region_button = Button(
        display_text='Add Region',
        name='add-region-button',
        icon='glyphicon glyphicon-plus',
        style='success'
    )
    context = {
        "select_region": select_region,
        "select_region_button": select_region_button,
        "add_region_button": add_region_button,
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


    return render(request, 'the_snowmen_snowpack_viewer/modis.html')
