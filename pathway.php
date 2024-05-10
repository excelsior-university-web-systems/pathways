function add_pathway_files(){
    global $post;
    if (is_single('degree-pathway') || is_page('review')) {
		wp_enqueue_script('sortable-js', 'https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.15.2/Sortable.min.js', array(), null, true);
		wp_enqueue_script('bootstrap-js', 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js', array(), null, true);
		wp_enqueue_style('bootstrap-css', 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css', array(), null, 'all');
        wp_enqueue_style('fontawesome-css', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css', array(), null, 'all');
        wp_enqueue_style('pathways-css', 'https://excelsior-university-web-systems.github.io/pathways/pathways.css', array(), null, 'all');
        wp_enqueue_script('pathways-js', 'https://excelsior-university-web-systems.github.io/pathways/pathways.js', array(), null, true);
    }
}
add_action('wp_enqueue_scripts', 'add_pathway_files');

// This code snippet creates a shortcode [degree_pathway]. When placed on a page, it will render the pathway UI.

// Function to fetch alternative courses for a given requirement_id
function fetch_alternative_courses($requirement_id, $pathway_id) {
    global $wpdb;
    $prefix = 'pathways_';
    $query = $wpdb->prepare(
        "SELECT DISTINCT pc.course_id, pc.course_number, pc.course_title, pc.course_description
        FROM {$prefix}courses AS pc
        INNER JOIN {$prefix}alternatives AS pa ON pc.course_id = pa.alternative_course_id
        INNER JOIN {$prefix}course_link AS pcl ON pcl.link_id = pa.link_id
        WHERE pcl.requirement_id = %d AND pcl.pathway_id = %d",
        $requirement_id, $pathway_id
    );
    return $wpdb->get_results($query);
}
// Main function to generate degree pathway
function generate_degree_pathway() {
    global $wpdb;
    $prefix = 'pathways_';

	if(is_single('degree-pathway')) {
		$data = call_sis_api();
	    $combination_id = $data['mapDegrees'][0]['programCombinationIdSeq'] ?? null;
	   	$audit_id = $data['mapDegrees'][0]['auditDegreeIdSeq'] ?? null;
	   	$degree_name = htmlspecialchars($data['mapDegrees'][0]['programName'] ?? 'Not available');
		// Prepare the SQL query
		$query = $wpdb->prepare(
			"SELECT pathway_id FROM {$prefix}pathway WHERE pathway_combination = $combination_id AND pathway_audit = $audit_id AND pathway_publish = 'Y'",
		);		
	}
	if(is_page('review')) {
	   	$combination_id = sanitize_text_field($_GET['combination']);
		$audit_id = sanitize_text_field($_GET['audit']);
		$degree_name = sanitize_text_field($_GET['degree']);
		$published = sanitize_text_field($_GET['publish']);
		// Prepare the SQL query
		$query = $wpdb->prepare(
			"SELECT pathway_id FROM {$prefix}pathway WHERE pathway_combination = $combination_id AND pathway_audit = $audit_id",
		);				
	}	

    // Execute the query
    $pathway_id = $wpdb->get_var($query);
	if (!$pathway_id) {
		echo "<div class='alert alert-danger mt-5 text-center'><p><strong>This pathway is currently unavailable. Please contact your advisor.</strong></p><p>Reference: combination ID (" . $combination_id . ") and audit ID (" . $audit_id . ").</p></div><style>h1{display:none !important;}</style>";
	} else {

		$query = "
			SELECT pc.course_id, pc.course_number, pc.course_title, pc.course_description, pc.course_hours, pc.course_prereqs, pcl.year, pcl.term, pr.requirement_id, pr.requirement_name, pr.requirement_identifier
			FROM {$prefix}courses AS pc
			INNER JOIN {$prefix}course_link AS pcl ON pc.course_id = pcl.course_id
			INNER JOIN {$prefix}requirements AS pr ON pcl.requirement_id = pr.requirement_id
			WHERE pcl.pathway_id = %d
			ORDER BY pcl.year, pcl.term_order, pcl.course_id;
		";
		$results = $wpdb->get_results($wpdb->prepare($query, $pathway_id));
	
	echo "<h2 class='mt-0'>$degree_name</h2>
		<p class='path-description pb-2'>Drag term bars between courses to customize your pathway.</p>
		<div id='pathwaycontainer'>
  			<div id='pathwaynav'>
   				 <nav aria-haspopup='true' aria-expanded='false' aria-labelledby='degree pathway menu'>
     				 <ul>
        				<li id='jumpToYearContainer'>
							<button aria-haspopup='true' aria-expanded='false'>Jump to Year</button>
							<ul id='yearList'>
            					<li><a href='#year1term1'>Year 1</a></li>
            					<li><a href='#year2term1'>Year 2</a></li>
            					<li><a href='#year3term1'>Year 3</a></li>
            					<li><a href='#year4term1'>Year 4</a></li> 
          					</ul>
       					 </li>
						 <li>
                			<div id='dupe-notification' role='status' aria-live='polite'>
							</div>
						</li>
						<li id='toggleCourseVisibilityContainer'>
							<input id='toggleCourseVisibility' type='checkbox' name='toggleCourseVisibility' aria-checked='false'>
							<label for='toggleCourseVisibility'><span id='toggleLabel'>Hide Completed </span><span id='hiddenCourseCount' aria-live='polite'></span>
							</label>
						</li>
					</ul>
				</nav>
			</div>
		<ul id='sortable-list'>
		";
	$current_term = null;
        foreach ($results as $course) {
            $term_id = "year{$course->year}term{$course->term}";
            if ($current_term !== $term_id) {
                echo "<li class='term' id='$term_id'>Year {$course->year} - <strong>Term {$course->term}</strong>
						<i class='fas fa-chevron-up'></i>
						<i class='fas fa-chevron-down'></i>
					</li>";
                $current_term = $term_id;
            }
			$prereqs = '';
			if (empty($course->course_prereqs)) {
				$prereqs = 'None';
			}else {
				$prereqs = $course->course_prereqs;
			}
            $alternatives = fetch_alternative_courses($course->requirement_id, $pathway_id);
            echo "<li class='course' data-requirement-id='{$course->requirement_id}' data-course-id='{$course->course_number}' aria-live='polite'>
			<label>
				<input type='checkbox' name='{$course->course_number}' value='{$course->course_number}'>
				<span class='checkmark'></span>
			</label>
			<!-- Course Id & Name -->
			<div class='accordion'>
				<div class='accordion-item'>
					<button class='course-info accordion-button' id='{$course->course_number}Accordion' type='button' data-bs-toggle='collapse' data-bs-target='#{$course->course_number}' aria-expanded='false' aria-controls='{$course->course_number}'>
						<span class='courseid {$course->requirement_identifier}'>{$course->course_number}</span>
						<span class='course-name'>{$course->course_title}</span>
						<i class='fas fa-plus'></i>
					</button>
 					<!-- Course Description Accordion Body -->
					<div id='{$course->course_number}' class='collapse' aria-labelledby='{$course->course_number}Accordion' data-bs-parent='#{$course->course_number}Accordion'>
						<div class='accordion-body'>
							<div class='course-details'>
								{$course->course_description}
								<div class='course-pre-cred'>
									<div class='prerequisites'>
										<strong>Prerequisites</strong><br>
										<span>$prereqs</span>
									</div>
									<div class='credit-hours'>
										<strong>Credit Hours</strong><br>
										<span>{$course->course_hours}</span>
									</div>
								</div>
							</div>
							<div class='requirement small p-2 mt-2 {$course->requirement_identifier}'><strong>{$course->requirement_name}</strong></div>
						</div>
					</div>
				</div>
			</div>";
			// if you want the level, credit hours, or prereqs - add pc.course_level, pc.course_hours, or pc.course_prereqs to the query above
            // Display alternative courses
            if ($alternatives) {
                echo "<!-- Course Options -->
					<button type='button' class='options' data-bs-toggle='modal' data-bs-target='#{$course->course_number}Modal'>
						<i class='fas fa-plus'></i>
						Options Available
					</button>
					<!-- Course Options Modal -->     
					<div class='modal fade' id='{$course->course_number}Modal' tabindex='-1' role='dialog' aria-labelledby='{$course->course_number}ModalLabel' aria-hidden='true'>
						<div class='modal-dialog modal-dialog-centered modal-dialog-scrollable' role='document'>
							<div class='modal-content'>
								<div class='modal-header'>
									<h5 class='modal-title w-100' id='{$course->course_number}ModalLabel'>Alternative Courses Available</h5>
									<button type='button' class='close' data-bs-dismiss='modal' aria-label='Close'>
									<span aria-hidden='true'>&times;</span>
									</button>
								</div>
							<div class='modal-body'>
								<p><strong>Click on a course to replace your current selection. <span class='options-count'></span></strong></p>
								<p><i class='fa-solid fa-circle-exclamation' title='This icon indicates that this course already appears in your pathway.' aria-label='Indicates that this course already appears in your pathway.' role='img'></i> This icon denotes courses that already appear in your pathway.</p>
							<ul class='options-list'>
								<li aria-live='polite'>
									<div class='alert alert-success mb-0'>
										<h4 class='m-0 text-green'>Recommended Course</h4>
										<div class='options-container'>
											<button type='button' class='option-course'><span>{$course->course_number}</span> &nbsp;|&nbsp; <span>{$course->course_title}</span></button>
											<button type='button' data-bs-toggle='collapse' data-bs-target='#{$course->course_number}Option' aria-expanded='false' aria-controls='{$course->course_number}Option'><i class='fas fa-plus'></i></button>
										</div>
									<div class='collapse' id='{$course->course_number}Option'>
										<div class='card card-body mt-2'>
											{$course->course_description}
											<div class='course-pre-cred'>
												<div class='prerequisites'>
												<strong>Prerequisites</strong><br>
												<span>$prereqs</span>
												</div>
												<div class='credit-hours'>
												<strong>Credit Hours</strong><br>
												<span>{$course->course_hours}</span>
												</div>
											</div>
										</div>
									</div>  
								</div>
							</li>";
                foreach ($alternatives as $alt) {
                    echo "<li aria-live='polite'>
							<div class='options-container'>
							<button type='button' class='option-course'><span>{$alt->course_number}</span> &nbsp;|&nbsp; <span>{$alt->course_title}</span></button>
							<button type='button' data-bs-toggle='collapse' data-bs-target='#{$alt->course_number}' aria-expanded='false' aria-controls='{$alt->course_number}'><i class='fas fa-plus'></i></button>
							</div>
							<div class='collapse' id='{$alt->course_number}'>
								<div class='card card-body mt-2'>
									{$alt->course_description}
									<div class='course-pre-cred'>
										<div class='prerequisites'>
											<strong>Prerequisites</strong><br>
											<span>{$course->course_prereqs}</span>
										</div>
										<div class='credit-hours'>
											<strong>Credit Hours</strong><br>
											<span>{$course->course_hours}</span>
										</div>
									</div>
								</div>
							</div>
						</li>";
                }
                echo "</ul>
						</div>
						<div class='modal-footer'>
							<button class='close' type='button' class='button' data-bs-dismiss='modal' aria-label='Close'><strong>Close</strong></button>
						</div>";
            }

            echo "</li>";
        }
        if ($current_term !== null) {
            echo '</ul>';
        }
        echo "
		<!-- Pathway Reset Switch -->
		<div class='w-100 text-center d-flex justify-content-around'>
			<button class='button' type='button' data-bs-toggle='modal' data-bs-target='#resetPathway' aria-controls='resetPathway'><strong>Reset Pathway</strong></button>
			<button id='addYear' type='button' class='button' aria-label='Add Year'><strong>Add Year</strong></button>
			<button id='removeYear' type='button' class='button' aria-label='Remove Year'><strong>Remove Year</strong></button>
		</div>
		<div class='modal fade' id='resetPathway' tabindex='-1' aria-labelledby='resetPathwayLabel' aria-modal='true' role='dialog'>
			<div class='modal-dialog modal-dialog-centered modal-dialog-scrollable' role='document'>
				<div class='modal-content'>
				<div class='modal-header'>
					<h5 class='modal-title w-100' id='resetPathwayLabel'>Pathway Reset</h5>
					<button type='button' class='close' data-bs-dismiss='modal' aria-label='Close'>
					<span aria-hidden='true'>×</span>
					</button>
				</div>
				<div class='modal-body'>
					<div class='alert alert-warning text-center fw-bold mb-0' role='alert'>
						<p>Clicking YES will reset your degree pathway and remove all customizations you have made.</p>
						<p>There is no way to restore this.</p>
						<p>Are you sure you want to proceed?</p>
						<button type='button my-0' class='button'>YES</button>
					</div>
				</div>
				<div class='modal-footer'>
				<button type='button' data-bs-dismiss='modal' aria-label='Close'><strong>Close</strong></button>
				</div>
				</div>
			</div>
		</div>
		</div>";
	}
}
// Shortcode integration
function degree_pathway_shortcode($atts) {
    ob_start();
   	generate_degree_pathway();
    return ob_get_clean();
}
add_shortcode('degree_pathway', 'degree_pathway_shortcode');