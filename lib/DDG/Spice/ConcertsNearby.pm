package DDG::Spice::ConcertsNearby;
# ABSTRACT: Return list of Concerts from current or specified location

use DDG::Spice;

primary_example_queries "seatgeek Boston";

triggers start => "seatgeek";

spice to => 'http://api.seatgeek.com/2/events?geoip=true&per_page=10&callback={{callback}}';
spice wrap_jsonp_callback => 1;

handle remainder => sub {
  return $_;
};

1;