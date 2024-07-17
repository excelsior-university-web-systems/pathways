<<<EOD
<li class="course" data-course-id="{$courseid}" data-department="{$department}" data-credit-hours="{$credithours}" data-level="{$level}">
    <div class="accordion">
        <div class="accordion-item">
            <button class="accordion-button" id="{$courseid}-accordion" type="button" data-toggle="collapse" data-target="#{$courseid}-description" aria-expanded="false" aria-controls="#{$courseid}-description">
                <span class="courseid">{$courseid}</span>
                <span class="course-name">{$title}{$ztc}{$creditHours}</span>
                <i class='fas fa-plus'></i>
            </button>

            <!-- Course Description Accordion Body -->
            <div id="#{$courseid}-description" class="collapse" aria-labelledby="{$courseid}-accordion" data-parent="#{$courseid}-accordion">
                <div class="accordion-body">
                    <p>{$course-description}</p>
                    
                    <div class="course-details">

                            <div class="prerequisites">
                                <strong>Prerequisites</strong>
                                <span>{$prereqs}</span>
                            </div>
                            <div class="credit-hours">
                                <strong>Credit Hours</strong>
                                <span>{$creditHours}</span>
                            </div>
                            <div class="syllabus">
                                <strong>Syllabus</strong>
                                <span>{$syllabus}</span>
                            </div>
                            <!-- ZTC variable stores html -->
                            {$ztc}
                        </div> <!-- course-details-prereq-creds-syllabus-ztc -->

                    </div> <!-- course-details -->

                    
                </div> <!-- accordion-body -->
            </div> <!-- course number -->
        </div> <!-- accordion-item -->
    </div> <!-- accordion -->

</li>
EOD;


<li class='course' data-requirement-id='" . $course['requirement_id'] . "' data-course-id='" . $course['course_number'] . "'>
				<!-- Course Id & Name -->
				<div class='accordion'>
					<div class='accordion-item'>
						<button class='course-info accordion-button' id='" . $course['course_number'] . "Accordion' type='button' data-toggle='collapse' data-target='#" . $course['course_number'] . "' aria-expanded='false' aria-controls='" . $course['course_number'] . "'>
							<span class='courseid " . $course['requirement_identifier'] . "'>" . $course['course_number'] . "</span>
							<span class='course-name'>" . $course['course_title'] . "" . $options . "" . $ztc . "</span>
							<i class='fas fa-plus'></i>
						</button>
						<!-- Course Description Accordion Body -->
						<div id='" . $course['course_number'] . "' class='collapse' aria-labelledby='" . $course['course_number'] . "Accordion' data-parent='#" . $course['course_number'] . "Accordion'>
							<div class='accordion-body'>
								<div class='course-details'>
									" . $course['course_description'] . "
									<div class='course-pre-cred'>
										<div class='prerequisites'>
											<strong>Prerequisites</strong><br>
											<span>$prereqs</span>
										</div>
										<div class='credit-hours'>
											<strong>Credit Hours</strong><br>
											<span>" . $course['course_hours'] . "</span>
										</div>
									</div> <!-- course-pre-cred -->
								</div> <!-- course-details -->
								<div class='requirement small p-2 mt-2 " . $course['requirement_identifier'] . "'>
									<strong>" . $course['requirement_name'] . "</strong>
								</div>
							</div> <!-- accordion-body -->
						</div> <!-- course number -->
					</div> <!-- accordion-item -->
				</div> <!-- accordion -->
			</li>    