# Require any additional compass plugins here.

# Set this to the root of your project when deployed:
http_path = "/"

# Paths to the base theme directories.
css_dir = "sites/all/themes/ngTheme/css"
sass_dir = "sites/all/themes/ngTheme/sass"
javascripts_dir = "sites/all/ngTheme/js"
project_type = :stand_alone

images_path = "sites/all/themes/ngTheme/assets"

# Images are located in the mosaic theme
icons_dir  = "sites/all/themes/ngTheme/assets/icons"
#vtiles_dir = "sites/all/themes/ngTheme/assets/vtiles"
#htiles_dir = "sites/all/themes/ngTheme/assets/htiles"

require 'sassy-buttons'


# You can select your preferred output style here (can be overridden via the command line):
# output_style = :expanded or :nested or :compact or :compressed

# To enable relative paths to assets via compass helper functions. Uncomment:
#relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:
# line_comments = false


# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:

#preferred_syntax = :sass

# and then run:
# sass-convert -R --from scss --to sass sass scss && rm -rf sass && mv scss sass
# sass-convert -R --from scss --to sass scss sass
