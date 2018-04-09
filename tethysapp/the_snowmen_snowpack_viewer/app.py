from tethys_sdk.base import TethysAppBase, url_map_maker


class TheSnowmenSnowpackViewer(TethysAppBase):
    """
    Tethys app class for The Snowmen Snowpack Viewer.
    """

    name = 'The Snowmen Snowpack Viewer'
    index = 'the_snowmen_snowpack_viewer:home'
    icon = 'the_snowmen_snowpack_viewer/images/snowpack1.gif'
    package = 'the_snowmen_snowpack_viewer'
    root_url = 'the-snowmen-snowpack-viewer'
    color = '#2980b9'
    description = 'This application calculates and visualizes snowpack data using MODIS satellite data and snowtel network station data.'
    tags = 'Hydrology, Snow Depth, Snow Cover'
    enable_feedback = False
    feedback_emails = []

    def url_maps(self):
        """
        Add controllers
        """
        UrlMap = url_map_maker(self.root_url)

        url_maps = (
            UrlMap(
                name='home',
                url='the-snowmen-snowpack-viewer',
                controller='the_snowmen_snowpack_viewer.controllers.home'
            ),
            UrlMap(
                name='about',
                url='the-snowmen-snowpack-viewer/about',
                controller='the_snowmen_snowpack_viewer.controllers.about'
            ),
            UrlMap(
                name='proposal',
                url='the-snowmen-snowpack-viewer/proposal',
                controller='the_snowmen_snowpack_viewer.controllers.proposal'
            ),
            UrlMap(
                name='mockup',
                url='the-snowmen-snowpack-viewer/mockup',
                controller='the_snowmen_snowpack_viewer.controllers.mockup'
            ),
            UrlMap(
                name='data_services',
                url='the-snowmen-snowpack-viewer/data_services',
                controller='the_snowmen_snowpack_viewer.controllers.data_services'
            ),

            UrlMap(
                name='animation',
                url='the-snowmen-snowpack-viewer/animation',
                controller='the_snowmen_snowpack_viewer.controllers.animation'
            ),
            UrlMap(
                name='gpservice',
                url='the-snowmen-snowpack-viewer/gpservice',
                controller='the_snowmen_snowpack_viewer.controllers.gpservice'
            ),
            UrlMap(
                name='modis',
                url='the-snowmen-snowpack-viewer/modis',
                controller='the_snowmen_snowpack_viewer.controllers.modis'
            ),
            UrlMap(
                name='polygontool',
                url='the-snowmen-snowpack-viewer/polygontool',
                controller='the_snowmen_snowpack_viewer.controllers.polygontool'
            ),
            UrlMap(
                name='region',
                url='the-snowmen-snowpack-viewer/region',
                controller='the_snowmen_snowpack_viewer.controllers.region'
            ),
            UrlMap(
                name='watershedtool',
                url='the-snowmen-snowpack-viewer/watershedtool',
                controller='the_snowmen_snowpack_viewer.controllers.watershedtool'
            ),
        )

        return url_maps
