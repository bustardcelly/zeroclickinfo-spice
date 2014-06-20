/*global Spice*/
(function(env) {
  "use strict";

  env.ddg_spice_concert_locator = function(api_result) {
    if(api_result.error) {
      return Spice.failed('concerts_nearby');
    }

    Spice.add({
      id: 'concerts_nearby',
      name: 'ConcertsNearby',
      data: api_result,
      meta: {
        sourceName: 'http://platform.seatgeek.com/',
        sourceUrl: 'http://api.seatgeek.com/2/events?geoip=true'
      },
      templates: {
        group: 'media',
        detail: 'products_detail',
        item_detail: 'products_item_detail',
        options: {
          content: Spice.concerts_nearby.content,
          moreAt: true
        }
      }
    });

  };

}(this));