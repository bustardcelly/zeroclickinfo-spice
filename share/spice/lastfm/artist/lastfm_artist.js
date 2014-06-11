( function ( env ) {
    "use strict";

    env.ddg_spice_lastfm_artist_all = function ( api_result ) {
        Spice.add( {
            id: 'lastfm_artist',
            name: 'Music',
            data: api_result.artist,
            signal: 'high',
            meta: {
                sourceName: 'Last.fm',
                sourceUrl: api_result.artist.url
            },
            normalize: function ( item ) {
                return {
                    description: DDG.strip_html( item.bio.summary ),
                    image: item.image[ 3 ][ "#text" ],
                    title: item.name
                };
            },
            template_group: 'info',

            templates: {
                options: {
                    moreAt: true
                }
            }
        } );

        $.ajaxSetup( {
            cache: true
        } );
        // Should be more accurate than the name.
        $.getScript( "/js/spice/lastfm/artist_tracks/" + api_result.artist.name );
    };

    env.ddg_spice_lastfm_artist_tracks = function ( api_result ) {
        var songs = [];
        // TODO: Use a template for this
        for ( var i = 0; i < api_result.toptracks.track.length; i++ ) {
            songs.push( "<a href='" + api_result.toptracks.track[ i ].url + "'>" + api_result.toptracks.track[ i ].name + "</a>" );
        }

        songs.splice( 3 );
        $( ".detail__songs" ).html( "Top Tracks: " + songs.join( ", " ) );
    };
}( this ) );
