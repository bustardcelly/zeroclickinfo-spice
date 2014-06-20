#!/usr/bin/env perl

use strict;
use warnings;
use Test::More;
use DDG::Test::Spice;

ddg_spice_test(
    [qw( DDG::Spice::ConcertsNearby )],
    'conloc' => test_spice(
        '/js/spice/concerts_nearby',
        call_type => 'include',
        caller => 'DDG::Spice::ConcertsNearby',
    )
);

done_testing;
