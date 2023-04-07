from functools import lru_cache

from jinja2 import Environment, PackageLoader, select_autoescape


@lru_cache
def get_jinja2_env():
    return Environment(
        loader=PackageLoader("go_tracker"),
        autoescape=select_autoescape(),
        trim_blocks=True,
        lstrip_blocks=True,
        optimized=True,
    )
