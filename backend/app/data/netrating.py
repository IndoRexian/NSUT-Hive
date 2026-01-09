import math
from decimal import DivisionByZero
from typing import List

CAT_1_weight = 0.4
CAT_2_weight = 0.3
CAT_3_weight = 0.2
CAT_4_weight = 0.1

min_reviews = 5
global_average = 3


def weighted_mean(data: dict) -> float:
    """
    Docstring for weighted_mean

    :param data: {'CAT_NUM':()}
    :type data: dict
    :return: Weighted Mean
    :rtype: int
    """
    try:
        mean = (
            (sum(data["CAT_1"]) / len(data["CAT_1"]) * CAT_1_weight)
            + (sum(data["CAT_2"]) / len(data["CAT_2"]) * CAT_2_weight)
            + (sum(data["CAT_3"]) / len(data["CAT_3"]) * CAT_3_weight)
            + (sum(data["CAT_4"]) / len(data["CAT_4"]) * CAT_4_weight)
        )
    except ZeroDivisionError:
        mean = 0
    return mean


def calculate_rating(reviews_count: int, data: dict):
    """
    Docstring for calculate_rating

    :param reviews_count: Total Reviews
    :type reviews_count: int
    :param data: {'CAT_NUM':( )}
    :type data: dict
    """
    w_mean = weighted_mean(data)
    final_rating = ((reviews_count / (reviews_count + min_reviews)) * w_mean) + (
        min_reviews / (reviews_count + min_reviews)
    ) * global_average

    return round(final_rating, 1)


def calculate_rating_per_cat(reviews_count: int, data: list):
    """
    Docstring for calculate_rating_per_cat

    :param reviews_count: Description
    :type reviews_count: int
    :param data: The list for that specific CAT
    :type data: list
    """
    try:
        mean = sum(data) / len(data)
    except ZeroDivisionError:
        return 0
    final_rating = ((reviews_count / (reviews_count + min_reviews)) * mean) + (
        min_reviews / (reviews_count + min_reviews)
    ) * global_average
    return round(final_rating, 1)
