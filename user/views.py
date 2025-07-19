from django.http import HttpResponse


def visits(request):
    num_visits = request.session.get("num_visits", 0) + 1
    request.session["num_visits"] = num_visits
    return HttpResponse(num_visits)
