DEPENDENCIES := $(shell find . -mindepth 1 -print)

../build/nhs_virtual_visits_functions.zip: $(DEPENDENCIES)
	zip ../build/nhs_virtual_visits_functions.zip $(DEPENDENCIES)
