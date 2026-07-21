<?php

test('the shared shell uses the Hotela logo as the favicon', function () {
    $response = $this->get(route('login'));

    $response->assertOk();
    $response->assertSee('href="/assets/Hotela-Logo.svg"', false);
});
