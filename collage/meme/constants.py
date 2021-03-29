import os

ROOT_DIR = os.getcwd()

SPONGE_BOB_FONT = os.getenv(
    'FONT', '{}/{}'.format(ROOT_DIR, 'fonts/Spongeboy Me Bob.ttf'))
IMPACTED_FONT = os.getenv(
    'FONT', '{}/{}'.format(ROOT_DIR, 'fonts/Impacted2.0.ttf'))

FONT_STYLE_DEFAULT = IMPACTED_FONT

FONT_SIZE_DEFAULT = 24

COLOR_CHANNEL = 'RGBA'

FONT_FILLS = {
    'black': (1, 22, 39),
    'red': (230, 57, 70),
    'light_green': (241, 250, 238),
    'sky_blue': (69, 123, 157),
    'navy_blue': (69, 123, 157)
}

FONT_FILL_DEFAULT = FONT_FILLS['black']

BG_FILL_DEFAULT = (255, 255, 255, 255)

COMMENT_POSITION_DEFAULT = False

COMMENT_WIDTH = os.getenv('CAPTION_WIDTH', 60)

