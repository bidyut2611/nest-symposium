=== Curtain Raiser for Inaugural Ceremony ===
Contributors: fitehal, deshabhishek007, samirmalpande
Donate link: http://www.whoisabhi.com/donate/
Tags: inaugural, curtain, ceremony, overlay, animation
Requires at least: 5.3
Tested up to: 7.0
Requires PHP: 7.4
Stable tag: 1.6.2
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Make your website launch feel special with a simple animated curtain effect.

== Description ==

Curtain Raiser helps you run a clean, memorable website inauguration.
Just share a link, and your visitors will see a closed curtain. Then open it at the right moment.

This plugin is especially useful for launch events, school/college announcements, NGO portals, and government website openings.

**Why people like it**

* Very easy to use
* Works on mobile and desktop
* Lets you open the curtain for everyone at once
* Supports custom colors and images
* Accessible and keyboard-friendly

**What's new in 1.6.2**

* Compatible with WordPress 7.0
* Hindi and Marathi translations now work
* Remote open/close now reliably reaches every attendee
* Countdown timer now follows your site timezone

**Main features**

* Trigger with a simple URL: `?curtain_ceremony=true`
* Set your own curtain color or image
* Set your own rope image
* Choose animation speed
* Optional countdown timer for auto-open
* Remote control from **Tools > Curtain Remote**
* Open and close the curtain for all live viewers
* Clean uninstall removes plugin data

To try quickly, [launch a TasteWP test site](https://tastewp.com/new?pre-installed-plugin-slug=wp-curtain-raiser&redirect=plugins.php&ni=true).

== Installation ==

1. Upload `wp-curtain-raiser` to `/wp-content/plugins/`
2. Activate it from the **Plugins** screen
3. Go to **Settings > Curtain Raiser** and choose your style
4. Open any page with `?curtain_ceremony=true`
5. Share that URL with your audience

== Frequently Asked Questions ==

= How do I start the curtain view? =

Add `?curtain_ceremony=true` to any page URL.
Example: `https://yourwebsite.com/?curtain_ceremony=true`

= Can I change the curtain look? =

Yes. Go to **Settings > Curtain Raiser**.
You can choose color, image, rope image, and animation speed.

= Can I open the curtain for everyone at the same time? =

Yes. Go to **Tools > Curtain Remote**, create a session, share the attendee link, then click **Open Curtain**.

= Can I also close it again? =

Yes. Use the **Close Curtain** button on the same Remote page.

= Will this slow down my website? =

No. Plugin assets load only on URLs where `?curtain_ceremony=true` is present.

= I do not see the curtain. What should I check? =

Usually one of these:
1. Missing `?curtain_ceremony=true` in the URL
2. Cache needs clearing
3. Theme/plugin CSS conflict

= How do I remove plugin data completely? =

Deactivate and delete the plugin from WordPress Plugins screen.
The uninstall routine removes stored settings and active remote session data.

== Screenshots ==

1. Add the query parameter to the URL.
2. Curtain overlay on page load.
3. Page after curtain opens.

== Changelog ==

= 1.6.2 =
* Tested up to WordPress 7.0
* Fixed: Hindi and Marathi translations were not loading on sites set to those languages
* Fixed: remote Open/Close now reaches every attendee — previously only one viewer received the signal
* Fixed: the countdown opened at the wrong time on sites not set to UTC; it now follows your site timezone
* Fixed: the `wp curtain-raiser preview-url` WP-CLI command did not work as documented
* Now requires WordPress 5.3 or newer

= 1.6.1 =
* Added Hindi translation files (`hi_IN`)
* Added Marathi translation files (`mr_IN`)

= 1.6.0 =
* Added Remote Control page under Tools
* Added attendee session link sharing
* Added open/close controls for live viewers
* Added secure token-based session flow
* Improved settings page clarity

= 1.5.0 =
* Added WP-CLI commands
* Added developer hooks and custom events

= 1.4.0 =
* Added gradient themes
* Added countdown timer

= 1.3.0 =
* Improved accessibility (dialog, focus, keyboard, live region)

= 1.1.0 =
* Removed jQuery dependency
* Improved animation performance and mobile behavior

= 1.0.0 =
* Added full settings page
* Added custom color/image options
* Added clean uninstall support

= 0.7 =
* Security and responsiveness improvements

= 0.6 =
* Security and responsive design updates

= 0.5 =
* Bug fixes and performance improvements

= 0.4 =
* Animation and UI improvements

= 0.3 =
* Cleaned assets folder

= 0.2 =
* Fixed query variable issue for static homepages

= 0.1 =
* Initial release

== Upgrade Notice ==

= 1.6.2 =
Important fixes: remote signals now reach all attendees, countdown respects site timezone. Plus WordPress 7.0 compatibility.

= 1.6.1 =
Adds Hindi and Marathi translation files.

= 1.6.0 =
Adds Remote Control with attendee sessions and open/close controls.

= 1.5.0 =
Adds WP-CLI support and developer hooks/events.

= 1.4.0 =
Adds theme presets and countdown timer.

= 1.3.0 =
Adds major accessibility improvements.

= 1.1.0 =
Removes jQuery dependency.

= 1.0.0 =
Major settings and architecture update.
